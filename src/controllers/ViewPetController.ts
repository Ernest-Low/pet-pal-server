import { Request, Response, NextFunction } from "express";
import prisma from "../../prisma/db/prisma";

const ViewPetController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Access the 'id' parameter from req.params
    const ownerId = parseInt(req.params.id);
    if (!ownerId) {
      return res.status(400).json({ status: "Owner ID is required" });
    }
    if (isNaN(Number(ownerId))) {
      return res.status(400).json({ status: "Owner ID must be a number" });
    }

    const foundOwner = await prisma.owner.findFirst({
      where: {
        ownerId,
      },
      select: {
        ownerId: true,
        petName: true,
        petGender: true,
        petAge: true,
        areaLocation: true,
        petPicture: true,
        petDescription: true,
      },
    });

    if (!foundOwner) {
      return res.status(404).json({ status: "Owner not found" });
    }

    return res
      .status(200)
      .json({ status: "Found owner", payload: { owner: foundOwner } });
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
};

export default ViewPetController;
