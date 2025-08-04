import Joi from "joi";
import { TaskStatus } from "../enums";

export const taskValidation = {
  createSchema: Joi.object({
    name: Joi.string().required().min(3).max(100),
    description: Joi.string().optional().max(500),
  }),

  updateSchema: Joi.object({
    name: Joi.string().optional().min(3).max(100),
    description: Joi.string().optional().max(500),
    status: Joi.string()
      .optional()
      .valid(...Object.values(TaskStatus)),
  }),

  idSchema: Joi.object({
    id: Joi.string()
      .required()
      .pattern(/^[0-9a-fA-F]{24}$/),
  }),
};
