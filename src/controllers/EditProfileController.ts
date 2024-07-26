import { Request, Response, NextFunction } from "express";
import argon2 from "argon2";
import prisma from "../../prisma/db/prisma";
import { editOwner } from "../joi/ownerSchema";
import cloudinary from "cloudinary";
import { config } from "../config/config";

// Initialize Cloudinary
cloudinary.v2.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (base64Image: string) => {
  try {
    const result = await cloudinary.v2.uploader.upload(base64Image, {
      // Add any necessary upload options here
    });
    return result;
  } catch (error) {
    console.error(
      "Error during Cloudinary upload:",
      truncateErrorMessage(error)
    ); // Detailed logging
    throw new Error(`Cloudinary upload failed: ${truncateErrorMessage(error)}`);
  }
};

const deleteFromCloudinary = async (publicId: string) => {
  try {
    await cloudinary.v2.uploader.destroy(publicId);
  } catch (error) {
    console.error(
      "Error during Cloudinary deletion:",
      truncateErrorMessage(error)
    ); // Detailed logging
  }
};

const truncateErrorMessage = (error: any, maxLength: number = 100) => {
  const message = error.message || "Unknown error";
  return message.length > maxLength
    ? `${message.substring(0, maxLength)}...`
    : message;
};

const EditProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { owner } = req.body;

    if (!owner) {
      return res
        .status(400)
        .json({ status: "Malformed request syntax, missing owner" });
    }

    // Validate request body against the schema
    const { error, value } = editOwner.validate(owner, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      const errorDetails = error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      return res.status(400).json({
        status: "Validation failed",
        payload: errorDetails,
      });
    }

    // Verify if the owner exists
    const verifyOwner = await prisma.owner.findUnique({
      where: { ownerId: owner.ownerId },
      select: { ownerId: true, email: true, petPicture: true, password: true },
    });

    if (!verifyOwner) {
      return res.status(404).json({ status: "Owner not found" });
    }

    // Verify that new email address isn't taken
    if (owner.email) {
      const verifyEmail = await prisma.owner.findUnique({
        where: { email: owner.email },
        select: { ownerId: true },
      });

      if (verifyEmail && verifyEmail.ownerId !== verifyOwner.ownerId) {
        return res.status(403).json({ status: "This email is already in use" });
      }
    }

    let changePassword = false;
    if (owner.oldPassword || owner.newPassword) {
      if (owner.oldPassword && owner.newPassword) {
        const match = await argon2.verify(
          verifyOwner.password,
          owner.oldPassword
        );
        if (!match) {
          return res.status(401).json({ status: "Your old password is wrong" });
        }
        changePassword = true;
      } else {
        return res.status(401).json({
          status: "Must provide both old and new passwords to change password",
        });
      }
    }

    // Handle image uploads and replacements
    let cloudinaryUrls: string[] = [];
    if (owner.petPicture && Array.isArray(owner.petPicture)) {
      for (const pic of owner.petPicture) {
        try {
          if (pic.startsWith("data:image/")) {
            // Assume base64 image
            const result = await uploadToCloudinary(pic);
            cloudinaryUrls.push(result.secure_url);
          } else {
            // If the image is already a URL or needs no conversion
            cloudinaryUrls.push(pic);
          }
        } catch (uploadError) {
          console.error(
            "Cloudinary upload failed:",
            truncateErrorMessage(uploadError)
          );
          return res
            .status(500)
            .json({
              status: "Image upload failed",
              message: truncateErrorMessage(uploadError),
            });
        }
      }
    }

    // Remove non-editable fields and add new data
    const { ownerId, oldPassword, newPassword, ...updateData } = owner;

    if (changePassword) {
      updateData.password = await argon2.hash(newPassword);
    }

    // Check if petPicture has changed and handle old images
    if (verifyOwner.petPicture) {
      for (const oldPic of verifyOwner.petPicture) {
        if (!cloudinaryUrls.includes(oldPic)) {
          // Assuming oldPic is a Cloudinary URL, extract publicId to delete it
          const publicId = oldPic.split("/").pop()?.split(".")[0] || "";
          await deleteFromCloudinary(publicId);
        }
      }
    }

    // Update owner
    const updatedOwner = await prisma.owner.update({
      where: { ownerId: verifyOwner.ownerId },
      data: {
        ...updateData,
        petPicture: cloudinaryUrls.length ? cloudinaryUrls : undefined,
      },
    });

    // Remove password from response
    const { password: _, ...resOwner } = updatedOwner;

    return res.status(200).json({
      status: "Owner updated successfully",
      payload: { owner: resOwner },
    });
  } catch (err) {
    // Detailed error logging
    console.error("Error updating owner:", truncateErrorMessage(err)); // Log the entire error object

    // Return a standard error response
    const message =
      err instanceof Error
        ? truncateErrorMessage(err)
        : "Internal server error";
    return res
      .status(500)
      .json({ status: "Internal server error", message: message });
  }
};

export default EditProfileController;
