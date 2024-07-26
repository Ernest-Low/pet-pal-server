import { Request, Response } from 'express';
import argon2 from 'argon2';
import prisma from '../../prisma/db/prisma';
import { registerOwner } from '../joi/ownerSchema';
import jwt from 'jsonwebtoken';
import { config } from '../config/config';
import cloudinary from 'cloudinary';

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
  } catch (error : any) {
    console.error('Error during Cloudinary upload:', error); // Detailed logging
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

const RegisterController = async (req: Request, res: Response) => {
  try {
    const { owner } = req.body;

    if (!owner) {
      return res.status(400).json({ status: "Malformed request syntax, missing owner" });
    }

    // Validate request body against the schema
    const { error, value } = registerOwner.validate(owner, {
      abortEarly: false,
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

    // Handle image uploads
    let cloudinaryUrls: string[] = [];
    if (petPicture && Array.isArray(petPicture)) {
      for (const pic of petPicture) {
        try {
          if (pic.startsWith('data:image/')) {
            // Assume base64 image
            const result = await uploadToCloudinary(pic);
            cloudinaryUrls.push(result.secure_url);
          } else {
            // If the image is already a URL or needs no conversion
            cloudinaryUrls.push(pic);
          }
        } catch (uploadError : any) {
          console.error('Cloudinary upload failed:', uploadError);
          return res.status(500).json({ status: "Image upload failed", message: uploadError.message });
        }
      }
    }

    // Create owner
    const created = await prisma.owner.create({
      data: {
        areaLocation: areaLocation!,
        ownerName: ownerName!,
        petPicture: cloudinaryUrls,
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

    // Generate JWT token
    const token = jwt.sign({ email: email }, config.AUTH_KEY, {
      expiresIn: '1h',
    });

    res.status(201).json({
      status: "User registered successfully",
      payload: { jwtToken: token, owner: created },
    });

  } catch (err) {
    // Detailed error logging
    console.error('Error registering user:', err); // Log the entire error object

    // Return a standard error response
    const message = err instanceof Error ? err.message : 'Internal server error';
    res.status(500).json({ status: "Internal server error", message: message });
  }
};

export default RegisterController;
