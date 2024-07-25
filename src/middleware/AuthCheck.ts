import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

interface UserPayload {
  email: string;
  iat: number;
  exp: number;
}

declare module "express-serve-static-core" {
  interface Request {
    email?: UserPayload;
  }
}

// Middleware to authenticate the token
const AuthCheck = (req: Request, res: Response, next: NextFunction) => {
  // const authHeader = req.headers["authorization"];     // JWT not being placed in headers
  // const token = authHeader && authHeader.split(" ")[1];
  const token: string = req.body.jwtToken;
  if (!token) return res.json({ status: "401: No token" });

  jwt.verify(token, config.AUTH_KEY, (err, email) => {
    if (err) return res.json({ status: "403: Token Forbidden" });
    req.email = email as UserPayload;
    next();
  });
};

export default AuthCheck;
