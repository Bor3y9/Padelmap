import { Request, Response, NextFunction } from "express";
import Joi from "joi";

export interface ValidationError {
  message: string;
  field?: string;
}

export class RequestValidationError extends Error {
  public errors: ValidationError[];
  public statusCode = 400;

  constructor(errors: ValidationError[]) {
    super("Request validation failed");
    this.errors = errors;
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serialize() {
    return this.errors;
  }
}

export const validateRequest = (
  schema: Joi.ObjectSchema,
  property: "body" | "params" | "query" = "body"
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Include all errors
      allowUnknown: false, // Don't allow extra fields
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const validationErrors: ValidationError[] = error.details.map(
        (detail) => ({
          message: detail.message,
          field: detail.path.join("."),
        })
      );

      return next(new RequestValidationError(validationErrors));
    }

    // Update the request with the validated value (this includes transformations)
    req[property] = value;

    next();
  };
};
