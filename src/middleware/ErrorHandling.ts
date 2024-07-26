import express, { Request, Response, NextFunction } from "express";

class CustomError extends Error {
  status?: number;
  type?: string;

  constructor(message: string, status?: number, type?: string) {
    super(message);
    this.status = status;
    this.type = type;
    this.name = "CustomError"; // Set the name property to identify this error type
  }
}

// ? To throw custom error:
// * throw new CustomError('Payload too large', 413, 'entity.too.large');

const MAX_ERROR_MESSAGE_LENGTH = 200; // Adjust the length as needed

const ErrorHandling = (
  err: Error | CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let message = "An unexpected error occurred";
  let statusCode = 500;

  if (err instanceof CustomError) {
    statusCode = err.status || 500;
    if (err.type === "entity.too.large") {
      message = "Payload Too Large";
      statusCode = 413;
    } else {
      message = err.message || "Internal server error";
    }
  }

  // Log the error with truncated message
  const logMessage =
    err.message && err.message.length > MAX_ERROR_MESSAGE_LENGTH
      ? err.message.substring(0, MAX_ERROR_MESSAGE_LENGTH) + "..."
      : err.message;

  console.error(logMessage);

  // Return a standard error response
  res.status(statusCode).json({
    status: "Error",
    message: message,
  });
};

export default ErrorHandling;
