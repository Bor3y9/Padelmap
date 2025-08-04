import { Router } from "express";

import { ClubController } from "./controllers/club.controller";

const clubController = new ClubController();

export const router = Router();

router.use("/clubs", clubController.loadRoutes());
