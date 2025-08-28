import { HTTPStatusCode } from "../common/enums";
import { ICourtAtr, ICourtCreationAtr } from "../common/interfaces";
import { CourtService } from "../services/court.service";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  courtCreationSchema,
  courtUpdateSchema,
  mongoIdSchema,
} from "../common/validation";
import { AuthHandler } from "../middlewares/auth-handler";

export class CourtController {
  private authHandler = new AuthHandler();

  constructor(private readonly service: CourtService = new CourtService()) {}

  private getList = asyncHandler(async (req: Request, res: Response) => {
    const courts = await this.service.list();

    res.status(HTTPStatusCode.OK).json({
      success: true,
      data: courts,
    });
  });

  private getById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;

      const court = await this.service.getById(id);
      if (!court) {
        res.status(HTTPStatusCode.NotFound).json({
          success: false,
          message: "Court not found",
          errors: [{ message: `Court with id ${id} not found` }],
        });
        return;
      }
      res.status(HTTPStatusCode.OK).json({
        success: true,
        data: court,
      });
    }
  );

  private postCreate = asyncHandler(
    async (req: Request<{}, {}, ICourtCreationAtr>, res: Response) => {
      try {
        const newCourt = await this.service.createOne(req.body);

        res.status(HTTPStatusCode.Created).json({
          success: true,
          message: "Court created successfully",
          data: newCourt,
        });
      } catch (error: any) {
        if (error.statusCode === 404 && error.field === "club") {
          res.status(HTTPStatusCode.NotFound).json({
            success: false,
            message: "Club not found",
            errors: [
              {
                field: "club",
                message: `Club with id ${req.body.club} not found`,
              },
            ],
          });
          return;
        }
        throw error;
      }
    }
  );

  private patchUpdate = asyncHandler(
    async (
      req: Request<{ id: string }, {}, Partial<ICourtAtr>>,
      res: Response
    ) => {
      const { id } = req.params;

      try {
        const updatedCourt = await this.service.updateById(id, req.body);

        if (!updatedCourt) {
          res.status(HTTPStatusCode.NotFound).json({
            success: false,
            message: "Court not found",
            errors: [{ message: `Court with id ${id} not found` }],
          });
          return;
        }

        res.status(HTTPStatusCode.OK).json({
          success: true,
          message: "Court updated successfully",
          data: updatedCourt,
        });
      } catch (error: any) {
        if (error.statusCode === 404 && error.field === "club") {
          res.status(HTTPStatusCode.NotFound).json({
            success: false,
            message: "Club not found",
            errors: [
              {
                field: "club",
                message: `Club with id ${req.body.club} not found`,
              },
            ],
          });
          return;
        }
        throw error;
      }
    }
  );

  private deleteById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;
      const deletedCourt = await this.service.deleteById(id);

      if (!deletedCourt) {
        res.status(HTTPStatusCode.NotFound).json({
          success: false,
          message: "Court not found",
          errors: [{ message: `Court with id ${id} not found` }],
        });
        return;
      }

      res.status(HTTPStatusCode.OK).json({
        success: true,
        message: "Court deleted successfully",
      });
    }
  );

  loadRoutes(): Router {
    const router = Router();

    // Public routes (anyone can view courts)
    router.get("/", this.getList);
    router.get("/:id", validateRequest(mongoIdSchema, "params"), this.getById);

    // Protected routes (authentication required for modifications)
    router.post(
      "/",
      this.authHandler.protect,
      validateRequest(courtCreationSchema, "body"),
      this.postCreate
    );
    router.patch(
      "/:id",
      this.authHandler.protect,
      validateRequest(mongoIdSchema, "params"),
      validateRequest(courtUpdateSchema, "body"),
      this.patchUpdate
    );
    router.delete(
      "/:id",
      this.authHandler.protect,
      validateRequest(mongoIdSchema, "params"),
      this.deleteById
    );

    return router;
  }
}
