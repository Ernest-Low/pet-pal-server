import { Request, Response } from "express";
import argon2 from "argon2";
import prisma from "../../prisma/db/prisma";
import { ownerSchema } from "../joi/ownerSchema";

const RegisterController = async (req: Request, res: Response) => {
  // Validate request body against the schema
  const { error, value } = ownerSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    // Create a detailed error response
    const errorDetails = error.details.map((err) => ({
      field: err.path.join("."), // Use dot notation for nested fields
      message: err.message,
    }));

    return res.status(400).json({
      message: "Validation failed",
      errors: errorDetails,
    });
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

  // Check if user already exists
  const foundUser = await prisma.owner.findFirst({
    where: { email },
    select: { email: true },
  });

  if (foundUser) {
    return res.status(400).send("User already exists");
  }

  try {
    await prisma.owner.create({
      data: {
        areaLocation: areaLocation!,
        ownerName: ownerName!,
        petPicture,
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
    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).send("Error registering user");
  }
};

export default RegisterController;
