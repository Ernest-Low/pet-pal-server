import { Request, Response } from "express";
import argon2 from "argon2";
import prisma from "../../prisma/db/prisma";
import { registerOwner } from "../joi/ownerSchema";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import cloudinary from "cloudinary";

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

const RegisterController = async (req: Request, res: Response) => {
  const { owner } = req.body;
  if (!owner) {
    return res
      .status(400)
      .json({ status: "Malformed request syntax, missing owner" });
  }

  const { error, value } = registerOwner.validate(owner, { abortEarly: false });

  if (error) {
    const errorDetails = error.details.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));

    return res
      .status(400)
      .json({ status: "Validation failed", payload: errorDetails });
  }

  const {
    email,
    password,
    areaLocation,
    ownerName,
    petPicture,
    petName,
    petBreed,
    petGender,
    petAge,
    petSize,
    petDescription,
    petIsNeutered,
  } = value;

  const foundUser = await prisma.owner.findFirst({
    where: { email },
    select: { email: true },
  });

  if (foundUser) {
    return res.status(400).json({ status: "Email already in use" });
  }

  try {
    const uploadPromises = petPicture.map((pic: string, index: number) =>
      uploadToCloudinary(pic, index)
    );
    const uploadResults = await Promise.all(uploadPromises);
    const petPictureUrls = uploadResults.map((result) => result.secure_url);

    const created = await prisma.owner.create({
      data: {
        areaLocation: areaLocation!,
        ownerName: ownerName!,
        petPicture: petPictureUrls,
        petName: petName!,
        petBreed: petBreed!,
        petGender: petGender!,
        petAge: petAge!,
        petSize: petSize!,
        petDescription: petDescription!,
        petIsNeutered: petIsNeutered,
        email,
        password: await argon2.hash(password),
      },
    });

    const foundUser = await prisma.owner.findFirst({ where: { email } });
    const { password: _, ...resUser } = foundUser!;
    const token = jwt.sign({ email: email }, config.AUTH_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      status: "User registered successfully",
      payload: { jwtToken: token, owner: resUser },
    });
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ status: "Error registering user" });
  }
};

export default RegisterController;
