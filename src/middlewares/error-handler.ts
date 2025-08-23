import { Request, Response, NextFunction } from "express";
import { RequestValidationError } from "./validation.middleware";
import { HTTPStatusCode } from "../common/enums";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error for debugging
  console.error("Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Handle validation errors
  if (err instanceof RequestValidationError) {
    res.status(err.statusCode).json({
      success: false,
      message: "Validation failed",
      errors: err.serialize(),
    });
    return;
  }

  // Handle specific MongoDB/Mongoose errors
  if (err.name === "ValidationError") {
    res.status(HTTPStatusCode.BadRequest).json({
      success: false,
      message: "Database validation failed",
      errors: [{ message: err.message }],
    });
    return;
  }

  if (err.name === "CastError") {
    res.status(HTTPStatusCode.BadRequest).json({
      success: false,
      message: "Invalid ID format",
      errors: [{ message: "The provided ID is not valid" }],
    });
    return;
  }

  // Handle MongoDB duplicate key error
  if (err.name === "MongoServerError" && (err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue)[0];
    const value = (err as any).keyValue[field];
    res.status(HTTPStatusCode.Conflict).json({
      success: false,
      message: "Duplicate value error",
      errors: [{ message: `${field} '${value}' already exists`, field }],
    });
    return;
  }

  // Handle JWT errors (for future authentication)
  if (err.name === "JsonWebTokenError") {
    res.status(HTTPStatusCode.Unauthorized).json({
      success: false,
      message: "Authentication failed",
      errors: [{ message: "Invalid token" }],
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(HTTPStatusCode.Unauthorized).json({
      success: false,
      message: "Authentication failed",
      errors: [{ message: "Token expired" }],
    });
    return;
  }

  // Default error response
  res.status(HTTPStatusCode.InternalServerError).json({
    success: false,
    message: "Internal server error",
    errors: [{ message: "Something went wrong!" }],
  });
};
