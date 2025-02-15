import { Request, Response, NextFunction } from "express";
import ErrorHandler from "../utils/errorHandler";

const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging (consider using a proper logging library in production)
  console.error(err);

  // CastError - MongoDB not found
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid ${(err as any).path}`;
    error = new ErrorHandler(message, 404);
  }

  // MongoDB duplicate key error
  if ((err as any).code === 11000) {
    const message = `Duplicate ${Object.keys((err as any).keyValue)} entered`;
    error = new ErrorHandler(message, 400);
  }

  // Wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "Token is invalid. Please log in again.";
    error = new ErrorHandler(message, 401);
  }

  // JWT expired error
  if (err.name === "TokenExpiredError") {
    const message = "Token has expired. Please log in again.";
    error = new ErrorHandler(message, 401);
  }

  res.status((error as ErrorHandler).statusCode || 500).json({
    success: false,
    message: error.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default errorMiddleware;