import Joi from "joi";

// Club validation schemas
export const clubCreationSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    "string.empty": "Club name is required",
    "string.min": "Club name must be at least 2 characters long",
    "string.max": "Club name cannot exceed 100 characters",
    "any.required": "Club name is required",
  }),

  location: Joi.string().trim().min(5).max(200).required().messages({
    "string.empty": "Location is required",
    "string.min": "Location must be at least 5 characters long",
    "string.max": "Location cannot exceed 200 characters",
    "any.required": "Location is required",
  }),

  contact: Joi.object({
    phone: Joi.string()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .required()
      .messages({
        "string.pattern.base": "Phone number must be a valid format",
        "string.empty": "Phone number is required",
        "any.required": "Phone number is required",
      }),

    email: Joi.string()
      .email()
      .optional()
      .allow("")
      .custom((value, helpers) => {
        if (value === "") {
          return undefined;
        }
        return value;
      })
      .messages({
        "string.email": "Email must be a valid email address",
      }),
  })
    .required()
    .messages({
      "any.required": "Contact information is required",
    }),
});

export const clubUpdateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    "string.min": "Club name must be at least 2 characters long",
    "string.max": "Club name cannot exceed 100 characters",
  }),

  location: Joi.string().trim().min(5).max(200).optional().messages({
    "string.min": "Location must be at least 5 characters long",
    "string.max": "Location cannot exceed 200 characters",
  }),

  contact: Joi.object({
    phone: Joi.string()
      .pattern(/^[\+]?[1-9][\d]{0,15}$/)
      .optional()
      .messages({
        "string.pattern.base": "Phone number must be a valid format",
      }),

    email: Joi.string()
      .email()
      .optional()
      .allow("")
      .custom((value, helpers) => {
        if (value === "") {
          return undefined;
        }
        return value;
      })
      .messages({
        "string.email": "Email must be a valid email address",
      }),
  }).optional(),
});

// ID validation schema
export const mongoIdSchema = Joi.object({
  id: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "Invalid ID format",
      "any.required": "ID is required",
    }),
});
