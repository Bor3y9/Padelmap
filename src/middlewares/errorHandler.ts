import { ErrorRequestHandler } from "express";
import { Request, Response, NextFunction } from "express";
import { HTTPStatusCode } from "../common/enums";
import Joi from "joi";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  if (
    err.message.includes("ValidationError") ||
    err.message.includes("fails")
  ) {
    res.status(HTTPStatusCode.BadRequest).json({
      error: err.message,
    });
    return;
  }

  if (err instanceof Joi.ValidationError || err.name === "ValidationError") {
    res.status(HTTPStatusCode.BadRequest).json({
      error: err.message,
    });
    return;
  }

  res.status(HTTPStatusCode.InternalServerError).json({
    error: "Something went wrong",
    message: err.message,
  });
};
