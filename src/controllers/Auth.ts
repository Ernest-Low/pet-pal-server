import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import prisma from "../../prisma/db/prisma";

const refreshToken = async (req: Request, res: Response) => {
  // After going through JWT middleware, email will be req.email
  const email = req.email?.email!;

  const foundUser = await prisma.owner.findUnique({
    where: {
      email,
    },
  });

  if (!foundUser) {
    return res.status(404).json({ status: "Owner not found" });
  }

  const { password: _, ...resUser } = foundUser;
  const token = jwt.sign({ email: email }, config.AUTH_KEY, {
    expiresIn: "1h",
  });

  res.status(200).json({
    status: "Verified JWT",
    payload: { owner: resUser, jwtToken: token },
  });
};

export default refreshToken;
