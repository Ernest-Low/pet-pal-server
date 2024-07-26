import { Request, Response } from "express";
import argon2 from "argon2";
import prisma from "../../prisma/db/prisma";
import { editOwner } from "../joi/ownerSchema";
import cloudinary from "cloudinary";
import { config } from "../config/config";

// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  api_secret: config.CLOUDINARY_API_SECRET,
});

const uploadToCloudinary = async (base64: string, index: number) => {
  return cloudinary.v2.uploader.upload(`data:image/jpeg;base64,${base64}`, {
    folder: "petPictures",
    public_id: `pet_${index}_${Date.now()}`,
  });
};

const deleteFromCloudinary = async (url: string) => {
  const publicId = url.split('/').pop()?.split('.').shift(); // Extract public ID from URL
  if (publicId) {
    return cloudinary.v2.uploader.destroy(`petPictures/${publicId}`);
  }
};

const EditProfileController = async (req: Request, res: Response) => {
  try {
    const { owner } = req.body;

    if (!owner) {
      return res
        .status(400)
        .json({ status: "Malformed request syntax, missing owner" });
    }

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

    const verifyOwner = await prisma.owner.findUnique({
      where: {
        ownerId: owner.ownerId,
      },
      select: { ownerId: true, password: true, email: true, petPicture: true },
    });

    if (!verifyOwner) {
      return res.status(404).json({ status: "Owner not found" });
    }

    const verifyEmail = await prisma.owner.findUnique({
      where: { email: owner.email },
      select: { ownerId: true },
    });

    if (verifyEmail && verifyEmail.ownerId !== verifyOwner.ownerId) {
      return res.status(403).json({ status: "This email is already in use" });
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

    const { ownerId, ownerMatches, ...updateData } = owner;

    if (changePassword) {
      updateData.password = await argon2.hash(owner.newPassword);
      delete updateData.newPassword;
      delete updateData.oldPassword;
    }

    if (updateData.petPicture) {
      const oldPictures = verifyOwner.petPicture as string[];
      const newPictures = updateData.petPicture as string[];

      const uploadPromises = newPictures.map(async (pic: string, index: number) => {
        if (pic.startsWith("data:image")) {
          const uploadResult = await uploadToCloudinary(pic, index);
          return uploadResult.secure_url;
        }
        return pic; // Keep the URL as is if it's not a base64 image
      });

      const newPictureUrls = await Promise.all(uploadPromises);

      // Delete old Cloudinary images if they are being replaced
      const oldCloudinaryPictures = oldPictures.filter(url => url.includes('res.cloudinary.com'));
      const deletePromises = oldCloudinaryPictures.map(url => deleteFromCloudinary(url));
      await Promise.all(deletePromises);

      updateData.petPicture = newPictureUrls;
    }

    const updatedOwner = await prisma.owner.update({
      where: {
        ownerId: verifyOwner.ownerId,
      },
      data: updateData,
    });

    const { password: _, ...resOwner } = updatedOwner;

    return res.status(200).json({
      status: "Owner updated successfully",
      payload: { owner: resOwner },
    });
  } catch (err) {
    console.error("Error updating owner:", err);
    return res.status(500).json({ status: "Internal server error" });
  }
};

export default EditProfileController;
