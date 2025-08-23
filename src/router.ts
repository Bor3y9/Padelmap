import { Router } from "express";

import { ClubController } from "./controllers/club.controller";
import { CourtController } from "./controllers/court.controller";

const clubController = new ClubController();
const courtController = new CourtController();

export const router = Router();

router.use("/clubs", clubController.loadRoutes());
router.use("/courts", courtController.loadRoutes());
