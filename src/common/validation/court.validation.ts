import Joi from "joi";
import { CourtStatus } from "../enums";

// Court validation schemas
export const courtCreationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Court name is required",
    "string.min": "Court name must be at least 2 characters long",
    "string.max": "Court name cannot exceed 100 characters",
    "any.required": "Court name is required",
  }),

  openingHours: Joi.object({
    start: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.pattern.base": "Start time must be in HH:MM format (24-hour)",
        "string.empty": "Start time is required",
        "any.required": "Start time is required",
      }),

    end: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .required()
      .messages({
        "string.pattern.base": "End time must be in HH:MM format (24-hour)",
        "string.empty": "End time is required",
        "any.required": "End time is required",
      }),
  })
    .required()
    .custom((value, helpers) => {
      const startTime = new Date(`2000-01-01T${value.start}:00`);
      const endTime = new Date(`2000-01-01T${value.end}:00`);

      if (startTime >= endTime) {
        return helpers.error("any.invalid");
      }

      return value;
    })
    .messages({
      "any.invalid": "End time must be after start time",
      "any.required": "Opening hours are required",
    }),

  pricePerHour: Joi.number().positive().precision(2).required().messages({
    "number.positive": "Price per hour must be a positive number",
    "number.base": "Price per hour must be a number",
    "any.required": "Price per hour is required",
  }),

  club: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Club ID must be a valid MongoDB ObjectId",
      "string.empty": "Club ID is required",
      "any.required": "Club ID is required",
    }),

  status: Joi.string()
    .valid(...Object.values(CourtStatus))
    .optional()
    .messages({
      "any.only": `Status must be one of: ${Object.values(CourtStatus).join(
        ", "
      )}`,
    }),
});

export const courtUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Court name must be at least 2 characters long",
    "string.max": "Court name cannot exceed 100 characters",
  }),

  openingHours: Joi.object({
    start: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional()
      .messages({
        "string.pattern.base": "Start time must be in HH:MM format (24-hour)",
      }),

    end: Joi.string()
      .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .optional()
      .messages({
        "string.pattern.base": "End time must be in HH:MM format (24-hour)",
      }),
  })
    .optional()
    .custom((value, helpers) => {
      if (value && value.start && value.end) {
        const startTime = new Date(`2000-01-01T${value.start}:00`);
        const endTime = new Date(`2000-01-01T${value.end}:00`);

        if (startTime >= endTime) {
          return helpers.error("any.invalid");
        }
      }

      return value;
    })
    .messages({
      "any.invalid": "End time must be after start time",
    }),

  pricePerHour: Joi.number().positive().precision(2).optional().messages({
    "number.positive": "Price per hour must be a positive number",
    "number.base": "Price per hour must be a number",
  }),

  club: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Club ID must be a valid MongoDB ObjectId",
    }),

  status: Joi.string()
    .valid(...Object.values(CourtStatus))
    .optional()
    .messages({
      "any.only": `Status must be one of: ${Object.values(CourtStatus).join(
        ", "
      )}`,
    }),
});
