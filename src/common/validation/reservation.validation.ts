import Joi from "joi";
import { ReservationStatus } from "../enums";

export const reservationCreationSchema = Joi.object({
  court: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Court ID must be a valid MongoDB ObjectId",
      "string.empty": "Court is required",
      "any.required": "Court is required",
    }),

  startTime: Joi.date().iso().min("now").required().messages({
    "date.base": "Start time must be a valid date",
    "date.iso": "Start time must be in ISO format",
    "date.min": "Start time cannot be in the past",
    "any.required": "Start time is required",
  }),

  endTime: Joi.date().iso().greater(Joi.ref("startTime")).required().messages({
    "date.base": "End time must be a valid date",
    "date.iso": "End time must be in ISO format",
    "date.greater": "End time must be after start time",
    "any.required": "End time is required",
  }),

  totalPrice: Joi.number().positive().precision(2).required().messages({
    "number.base": "Total price must be a number",
    "number.positive": "Total price must be positive",
    "number.precision": "Total price can have at most 2 decimal places",
    "any.required": "Total price is required",
  }),

  status: Joi.string()
    .valid(...Object.values(ReservationStatus))
    .default(ReservationStatus.CONFIRMED)
    .messages({
      "any.only": `Status must be one of: ${Object.values(
        ReservationStatus
      ).join(", ")}`,
    }),
});

export const reservationUpdateSchema = Joi.object({
  court: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .optional()
    .messages({
      "string.pattern.base": "Court ID must be a valid MongoDB ObjectId",
    }),

  startTime: Joi.date().iso().min("now").optional().messages({
    "date.base": "Start time must be a valid date",
    "date.iso": "Start time must be in ISO format",
    "date.min": "Start time cannot be in the past",
  }),

  endTime: Joi.date()
    .iso()
    .when("startTime", {
      is: Joi.exist(),
      then: Joi.date().greater(Joi.ref("startTime")),
      otherwise: Joi.date(),
    })
    .optional()
    .messages({
      "date.base": "End time must be a valid date",
      "date.iso": "End time must be in ISO format",
      "date.greater": "End time must be after start time",
    }),

  totalPrice: Joi.number().positive().precision(2).optional().messages({
    "number.base": "Total price must be a number",
    "number.positive": "Total price must be positive",
    "number.precision": "Total price can have at most 2 decimal places",
  }),

  status: Joi.string()
    .valid(...Object.values(ReservationStatus))
    .optional()
    .messages({
      "any.only": `Status must be one of: ${Object.values(
        ReservationStatus
      ).join(", ")}`,
    }),
});

export const reservationIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "ID must be a valid MongoDB ObjectId",
      "any.required": "ID is required",
    }),
});

export const courtIdSchema = Joi.object({
  courtId: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Court ID must be a valid MongoDB ObjectId",
      "any.required": "Court ID is required",
    }),
});
