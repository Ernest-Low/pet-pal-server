import express, { Request, Response, NextFunction } from "express";

const ErrorHandling = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);
  res.status(500).json({ status: "An unexpected error occurred!" });
};

export default ErrorHandling;
