import { HTTPStatusCode } from "../common/enums";
import { IClubAtr, IClubCreationAtr } from "../common/interfaces";
import { ClubService } from "../services/club.service";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { validateRequest } from "../middlewares/validation.middleware";
import {
  clubCreationSchema,
  clubUpdateSchema,
  mongoIdSchema,
} from "../common/validation";
import { AuthHandler } from "../middlewares/auth-handler";

export class ClubController {
  private authHandler = new AuthHandler();

  constructor(private readonly service: ClubService = new ClubService()) {}

  private getList = asyncHandler(async (req: Request, res: Response) => {
    const clubs = await this.service.list();

    res.status(HTTPStatusCode.OK).json({
      success: true,
      data: clubs,
    });
  });

  private getById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;

      const club = await this.service.getById(id);
      if (!club) {
        res.status(HTTPStatusCode.NotFound).json({
          success: false,
          message: "Club not found",
          errors: [{ message: `Club with id ${id} not found` }],
        });
        return;
      }
      res.status(HTTPStatusCode.OK).json({
        success: true,
        data: club,
      });
    }
  );

  private postCreate = asyncHandler(
    async (req: Request<{}, {}, IClubCreationAtr>, res: Response) => {
      const newClub = await this.service.createOne(req.body);

      res.status(HTTPStatusCode.Created).json({
        success: true,
        message: "Club created successfully",
        data: newClub,
      });
    }
  );

  private patchUpdate = asyncHandler(
    async (
      req: Request<{ id: string }, {}, Partial<IClubAtr>>,
      res: Response
    ) => {
      const { id } = req.params;
      const updatedClub = await this.service.updateById(id, req.body);

      if (!updatedClub) {
        res.status(HTTPStatusCode.NotFound).json({
          success: false,
          message: "Club not found",
          errors: [{ message: `Club with id ${id} not found` }],
        });
        return;
      }

      res.status(HTTPStatusCode.OK).json({
        success: true,
        message: "Club updated successfully",
        data: updatedClub,
      });
    }
  );

  private deleteById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;
      const deletedClub = await this.service.deleteById(id);

      if (!deletedClub) {
        res.status(HTTPStatusCode.NotFound).json({
          success: false,
          message: "Club not found",
          errors: [{ message: `Club with id ${id} not found` }],
        });
        return;
      }

      res.status(HTTPStatusCode.OK).json({
        success: true,
        message: "Club deleted successfully",
      });
    }
  );

  loadRoutes(): Router {
    const router = Router();

    // Public routes (anyone can view clubs)
    router.get("/", this.getList);
    router.get("/:id", validateRequest(mongoIdSchema, "params"), this.getById);

    // Protected routes (authentication required for modifications)
    router.post(
      "/",
      this.authHandler.protect,
      validateRequest(clubCreationSchema, "body"),
      this.postCreate
    );
    router.patch(
      "/:id",
      this.authHandler.protect,
      validateRequest(mongoIdSchema, "params"),
      validateRequest(clubUpdateSchema, "body"),
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
