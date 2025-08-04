import { Router } from "express";

import { TaskController } from "./controllers/club.controller";

const taskController = new TaskController();

export const router = Router();

router.use("/tasks", taskController.loadRoutes());
