import { Request, Response } from "express";

// Protected route OK (Check is done in middleware)
const protectedRoute = (req: Request, res: Response) => {
  res.status(200).send("Auth Ok");
};


export default protectedRoute