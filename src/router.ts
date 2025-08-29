import { Router } from "express";

import { ClubController } from "./controllers/club.controller";
import { CourtController } from "./controllers/court.controller";
import { UserController } from "./controllers/user.controller";
import { AuthController } from "./controllers/auth.controller";

const clubController = new ClubController();
const courtController = new CourtController();
const userController = new UserController();
const authController = new AuthController();

export const router = Router();

router.use("/auth", authController.loadRoutes());
router.use("/clubs", clubController.loadRoutes());
router.use("/courts", courtController.loadRoutes());
router.use("/users", userController.loadRoutes());
