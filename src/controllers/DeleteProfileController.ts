import { Request, Response } from "express";
import argon2 from "argon2";
import prisma from "../../prisma/db/prisma";

const DeleteProfileController = async (req: Request, res: Response) => {
  try {
    const email = req.email?.email;
    const { password } = req.body;

    if (!password) {
      return res
        .status(400)
        .json({ status: "Malformed request syntax, missing password" });
    }

    const foundUser = await prisma.owner.findUnique({
      where: {
        email,
      },
      select: {
        password: true,
      },
    });

    if (!foundUser) {
      return res.status(404).json({ status: "No user found?" });
    }

    const match = await argon2.verify(foundUser.password, password);

    if (!match) {
      return res.status(401).json({ status: "Wrong password" });
    }

    await prisma.owner.delete({
      where: {
        email,
      },
    });

    return res.status(200).json({ status: "Account has been deleted" });
  } catch (err) {
    console.error("Error updating owner:", err); // Log error for debugging
    return res.status(500).json({ status: "Internal server error" });
  }
};

export default DeleteProfileController;
