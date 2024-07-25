import { Request, Response } from "express";
import argon2 from "argon2";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import prisma from "../../prisma/db/prisma";

const secretKey = config.AUTH_KEY;

const LoginController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ status: "Email and password are required" });
  }

  const foundUser = await prisma.owner.findFirst({
    where: {
      email,
    },
    // select: {
    //   password: true,
    // },
  });

  if (!foundUser) {
    return res.status(400).json({ status: "Invalid email or password" });
  }

  try {
    const match = await argon2.verify(foundUser.password, password);
    if (match) {
      const token = jwt.sign({ email: email }, secretKey, {
        expiresIn: "1h",
      });
      const { password: _, ...resUser } = foundUser;
      res
        .status(200)
        .json({
          status: "Successfully logged in",
          payload: { owner: resUser, jwtToken: token },
        });
    } else {
      res.status(400).json({ status: "Invalid email or password" });
    }
  } catch (err) {
    res.status(400).json({ status: "Error logging in user" });
  }
};

export default LoginController;
