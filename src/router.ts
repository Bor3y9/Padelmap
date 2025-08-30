import { Router } from "express";

import { ClubController } from "./controllers/club.controller";
import { CourtController } from "./controllers/court.controller";
import { UserController } from "./controllers/user.controller";
import { AuthController } from "./controllers/auth.controller";
import { ReservationController } from "./controllers/reservation.controller";

const clubController = new ClubController();
const courtController = new CourtController();
const userController = new UserController();
const authController = new AuthController();
const reservationController = new ReservationController();

export const router = Router();

router.use("/auth", authController.loadRoutes());
router.use("/clubs", clubController.loadRoutes());
router.use("/courts", courtController.loadRoutes());
router.use("/users", userController.loadRoutes());
router.use("/reservations", reservationController.loadRoutes());
