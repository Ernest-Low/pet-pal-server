import { Request, Response } from "express";
import argon2 from "argon2";
import prisma from "../../prisma/db/prisma";
import { editOwner } from "../joi/ownerSchema";

const EditProfileController = async (req: Request, res: Response) => {
  try {
    const email = req.email?.email;
    const { owner } = req.body;

    // ! Add another check to verify ownerid cant be messed with to pull wrong user
    // ? Ugh maybe thats why changing password asks for old password
    // * This aint fixable in current interation likely, frontend gonna complain (No time)

    if (!owner) {
      return res
        .status(400)
        .json({ status: "Malformed request syntax, missing owner" });
    }

    // Validate request body against the schema
    const { error, value } = editOwner.validate(owner, {
      abortEarly: false,
      allowUnknown: true, // Allow unknown keys to be ignored
    });

    if (error) {
      // Create a detailed error response
      const errorDetails = error.details.map((err) => ({
        field: err.path.join("."), // Use dot notation for nested fields
        message: err.message,
      }));

      return res.status(400).json({
        status: "Validation failed",
        payload: errorDetails,
      });
    }

    // const ownerUpdates = value as OwnerType;

    // Verify if the owner exists
    const verifyOwner = await prisma.owner.findUnique({
      where: {
        ownerId: owner.ownerId,
      },
      select: { ownerId: true, password: true, email: true },
    });

    if (!verifyOwner) {
      return res.status(404).json({ status: "Owner not found" });
    }

    // Verify that new email address isn't taken
    const verifyEmail = await prisma.owner.findUnique({
      where: { email },
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

    // // Create a new object for updated fields
    // const updatedFields: Partial<OwnerType> = { ...ownerUpdates };

    // // Handle password separately
    // if (updatedFields.password) {
    //   const isPasswordValid = await argon2.verify(
    //     verifyOwner.password,
    //     updatedFields.password
    //   );

    //   if (!isPasswordValid) {
    //     updatedFields.password = await argon2.hash(updatedFields.password);
    //   } else {
    //     delete updatedFields.password; // Passwords match, no need to update
    //   }
    // }

    // Exclude non-editable fields
    const { ownerId, ownerMatches, ...updateData } = owner;

    // Add in the new desired password
    if (changePassword) {
      owner.password = owner.newPassword;
    }

    // Update owner
    const updatedOwner = await prisma.owner.update({
      where: {
        ownerId: verifyOwner.ownerId,
      },
      data: updateData,
    });

    // Remove password from response
    const { password: _, ...resOwner } = updatedOwner;

    return res.status(200).json({
      status: "Owner updated successfully",
      payload: { owner: resOwner },
    });
  } catch (err) {
    console.error("Error updating owner:", err); // Log error for debugging
    return res.status(500).json({ status: "Internal server error" });
  }
};

export default EditProfileController;
