import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../../config/config";

interface UserPayload {
  username: string;
  iat: number;
  exp: number;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: UserPayload;
  }
}

// Middleware to authenticate the token
const AuthCheck = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, config.AUTH_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user as UserPayload;
    next();
  });
};

export default AuthCheck;
