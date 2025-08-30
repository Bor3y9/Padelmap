import { HTTPStatusCode } from "../common/enums";
import { IReservationAtr, IReservationCreationAtr } from "../common/interfaces";
import { ReservationService } from "../services/reservation.service";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  reservationCreationSchema,
  reservationUpdateSchema,
  reservationIdSchema,
  courtIdSchema,
  mongoIdSchema,
} from "../common/validation";
import { AuthHandler } from "../middlewares/auth-handler";

export class ReservationController {
  private authHandler = new AuthHandler();

  constructor(
    private readonly service: ReservationService = new ReservationService()
  ) {}

  private getList = asyncHandler(async (req: Request, res: Response) => {
    const reservations = await this.service.list();

    res.status(HTTPStatusCode.OK).json({
      success: true,
      data: reservations,
    });
  });

  private getById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;

      const reservation = await this.service.getById(id);
      if (!reservation) {
        res.status(HTTPStatusCode.NotFound).json({
          success: false,
          message: "Reservation not found",
          errors: [{ message: `Reservation with id ${id} not found` }],
        });
        return;
      }
      res.status(HTTPStatusCode.OK).json({
        success: true,
        data: reservation,
      });
    }
  );

  private postCreate = asyncHandler(
    async (req: Request<{}, {}, IReservationCreationAtr>, res: Response) => {
      // Set the user from the authenticated request
      const reservationData = {
        ...req.body,
        user: req.user._id,
      };

      const newReservation = await this.service.createOne(reservationData);

      res.status(HTTPStatusCode.Created).json({
        success: true,
        message: "Reservation created successfully",
        data: newReservation,
      });
    }
  );

  private patchUpdate = asyncHandler(
    async (
      req: Request<{ id: string }, {}, Partial<IReservationAtr>>,
      res: Response
    ) => {
      const { id } = req.params;
      const updatedReservation = await this.service.updateById(req.body, id);

      if (!updatedReservation) {
        res.status(HTTPStatusCode.NotFound).json({
          success: false,
          message: "Reservation not found",
          errors: [{ message: `Reservation with id ${id} not found` }],
        });
        return;
      }

      res.status(HTTPStatusCode.OK).json({
        success: true,
        message: "Reservation updated successfully",
        data: updatedReservation,
      });
    }
  );

  private deleteById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;
      const deletedReservation = await this.service.deleteById(id);

      if (!deletedReservation) {
        res.status(HTTPStatusCode.NotFound).json({
          success: false,
          message: "Reservation not found",
          errors: [{ message: `Reservation with id ${id} not found` }],
        });
        return;
      }

      res.status(HTTPStatusCode.OK).json({
        success: true,
        message: "Reservation deleted successfully",
      });
    }
  );

  private getUserReservations = asyncHandler(
    async (req: Request, res: Response) => {
      const userId = req.user._id;
      const userReservations = await this.service.getUserReservations(userId);

      res.status(HTTPStatusCode.OK).json({
        success: true,
        data: userReservations,
      });
    }
  );

  private getCourtReservations = asyncHandler(
    async (req: Request<{ courtId: string }>, res: Response) => {
      const { courtId } = req.params;
      const courtReservations = await this.service.getCourtReservations(
        courtId
      );

      res.status(HTTPStatusCode.OK).json({
        success: true,
        data: courtReservations,
      });
    }
  );

  private getCourtAvailability = asyncHandler(
    async (req: Request<{ courtId: string }>, res: Response) => {
      const { courtId } = req.params;
      const { date } = req.query;

      if (!date || typeof date !== "string") {
        res.status(HTTPStatusCode.BadRequest).json({
          success: false,
          message: "Date parameter is required",
          errors: [
            { message: "Date parameter is required in YYYY-MM-DD format" },
          ],
        });
        return;
      }

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const reservations = await this.service.getCourtReservationsInRange(
        courtId,
        startOfDay,
        endOfDay
      );

      res.status(HTTPStatusCode.OK).json({
        success: true,
        data: {
          date,
          courtId,
          reservations,
        },
      });
    }
  );

  loadRoutes(): Router {
    const router = Router();

    // Public routes (view reservations - might need to be restricted based on business logic)
    router.get("/", this.authHandler.protect, this.getList);
    router.get(
      "/my-reservations",
      this.authHandler.protect,
      this.getUserReservations
    );
    router.get(
      "/court/:courtId",
      validateRequest(courtIdSchema, "params"),
      this.getCourtReservations
    );
    router.get(
      "/court/:courtId/availability",
      validateRequest(courtIdSchema, "params"),
      this.getCourtAvailability
    );
    router.get(
      "/:id",
      validateRequest(reservationIdSchema, "params"),
      this.getById
    );

    // Protected routes (require authentication)
    router.post(
      "/",
      this.authHandler.protect,
      validateRequest(reservationCreationSchema, "body"),
      this.postCreate
    );
    router.patch(
      "/:id",
      this.authHandler.protect,
      validateRequest(reservationIdSchema, "params"),
      validateRequest(reservationUpdateSchema, "body"),
      this.patchUpdate
    );
    router.delete(
      "/:id",
      this.authHandler.protect,
      validateRequest(reservationIdSchema, "params"),
      this.deleteById
    );

    return router;
  }
}
