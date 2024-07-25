import { Request, Response } from "express";
import prisma from "../../prisma/db/prisma";

const OwnerProfileController = async (req: Request, res: Response) => {
  // After going through JWT middleware, email will be req.email
  const email = req.email?.email!;

  const foundOwner = await prisma.owner.findUnique({
    where: {
      email,
    },
  });

  if (!foundOwner) {
    return res.status(404).json({ status: "Owner not found" });
  }
  const { password: _, ...resOwner } = foundOwner;

  return res
    .status(200)
    .json({ status: "Found owner", payload: { owner: resOwner } });
};

export default OwnerProfileController;
