import { Request, Response } from "express";
import argon2 from "argon2";
import prisma from "../../prisma/db/prisma";
import { registerOwner } from "../joi/ownerSchema";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

const RegisterController = async (req: Request, res: Response) => {
  const { owner } = req.body;
  if (!owner) {
    return res
      .status(400)
      .json({ status: "Malformed request syntax, missing owner" });
  }

  // Validate request body against the schema
  const { error, value } = registerOwner.validate(owner, {
    abortEarly: false,
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
    return res.status(400).json({ status: "Email already in use" });
  }

  try {
    const created = await prisma.owner.create({
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

    // console.log("checking created ownerID: " + created.ownerId);

    const foundUser = await prisma.owner.findFirst({
      where: {
        email,
      },
    });
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
