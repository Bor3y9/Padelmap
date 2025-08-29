import Joi from "joi";
import { UserRole } from "../enums";

// Validation schema for user registration
export const registerUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      "string.empty": "Name is required",
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must not exceed 50 characters",
      "string.pattern.base": "Name can only contain letters and spaces",
    }),

  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "string.empty": "Password is required",
    }),

  passwordConfirm: Joi.string().valid(Joi.ref("password")).required().messages({
    "any.only": "Password confirmation does not match password",
    "string.empty": "Password confirmation is required",
  }),

  phoneNumber: Joi.string()
    .pattern(/^\+[1-9]\d{1,14}$/)
    .required()
    .messages({
      "string.pattern.base":
        "Phone number must be in international format (e.g., +201234567890)",
      "string.empty": "Phone number is required",
    }),

  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional()
    .default(UserRole.Player)
    .messages({
      "any.only": `Role must be one of: ${Object.values(UserRole).join(", ")}`,
    }),
});

// Validation schema for user update
export const updateUserSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-Z\s]+$/)
    .optional()
    .messages({
      "string.min": "Name must be at least 2 characters long",
      "string.max": "Name must not exceed 50 characters",
      "string.pattern.base": "Name can only contain letters and spaces",
    }),

  email: Joi.string().email().lowercase().optional().messages({
    "string.email": "Please provide a valid email address",
  }),

  phoneNumber: Joi.string()
    .pattern(/^\[1-9]\d{1,14}$/)
    .optional()
    .messages({
      "string.pattern.base":
        "Phone number must be in international format (e.g., +201234567890)",
    }),

  role: Joi.string()
    .valid(...Object.values(UserRole))
    .optional()
    .messages({
      "any.only": `Role must be one of: ${Object.values(UserRole).join(", ")}`,
    }),
});

// Validation schema for user login
export const loginUserSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),

  password: Joi.string().required().messages({
    "string.empty": "Password is required",
  }),
});

export const validateUniqueFields = async (
  data: { email?: string; phoneNumber?: string },
  userId?: string
) => {
  const errors: Array<{ message: string; field: string }> = [];

  // Check for duplicate email
  if (data.email) {
    const { UserRepository } = await import(
      "../../repositories/user.repository"
    );
    const userRepo = new UserRepository();

    const existingUserByEmail = await userRepo.findById({ email: data.email });
    if (existingUserByEmail && existingUserByEmail._id.toString() !== userId) {
      errors.push({ message: "Email is already registered", field: "email" });
    }
  }

  // Check for duplicate phone number
  if (data.phoneNumber) {
    const { UserRepository } = await import(
      "../../repositories/user.repository"
    );
    const userRepo = new UserRepository();

    const existingUserByPhone = await userRepo.findById({
      phoneNumber: data.phoneNumber,
    });
    if (existingUserByPhone && existingUserByPhone._id.toString() !== userId) {
      errors.push({
        message: "Phone number is already registered",
        field: "phoneNumber",
      });
    }
  }

  return errors;
};

// Validation schema for change password
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    "string.empty": "Current password is required",
  }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.min": "New password must be at least 8 characters long",
      "string.pattern.base":
        "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "string.empty": "New password is required",
    }),
});

// Validation schema for forgot password
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().lowercase().required().messages({
    "string.email": "Please provide a valid email address",
    "string.empty": "Email is required",
  }),
});

// Validation schema for reset password
export const resetPasswordSchema = Joi.object({
  resetToken: Joi.string().required().messages({
    "string.empty": "Reset token is required",
  }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      "string.min": "New password must be at least 8 characters long",
      "string.pattern.base":
        "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      "string.empty": "New password is required",
    }),
});
