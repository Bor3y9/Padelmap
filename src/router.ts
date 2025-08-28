import { Router } from "express";

import { ClubController } from "./controllers/club.controller";
import { CourtController } from "./controllers/court.controller";
import { UserController } from "./controllers/user.controller";

const clubController = new ClubController();
const courtController = new CourtController();
const userController = new UserController();

export const router = Router();

router.use("/clubs", clubController.loadRoutes());
router.use("/courts", courtController.loadRoutes());
router.use("/users", userController.loadRoutes());
