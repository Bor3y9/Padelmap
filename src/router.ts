import { Router } from "express";

import { TaskController } from "./controllers/task.controller";

const taskController = new TaskController();

export const router = Router();

router.use("/tasks", taskController.loadRoutes());
