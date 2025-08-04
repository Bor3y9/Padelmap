import { HTTPStatusCode } from "../common/enums";
import { IClubAtr, IClubCreationAtr } from "../common/interfaces";
import { ClubService } from "../services/club.service";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";

export class ClubController {
  constructor(private readonly service: ClubService = new ClubService()) {}

  private getList = asyncHandler(async (req: Request, res: Response) => {
    const clubs = await this.service.list();

    res.status(HTTPStatusCode.OK).json({
      data: clubs,
    });
  });

  private getById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;
      const club = await this.service.getById(id);

      if (!club) {
        res.status(HTTPStatusCode.NotFound).json({
          error: `Club with id ${id} not found`,
        });
        return;
      }

      res.status(HTTPStatusCode.OK).json({
        data: club,
      });
    }
  );

  private postCreate = asyncHandler(
    async (req: Request<{}, {}, IClubCreationAtr>, res: Response) => {
      const newClub = await this.service.createOne(req.body);
      if (!newClub) {
        res.status(HTTPStatusCode.BadRequest).json({
          error: "Failed to create club",
        });
        return;
      }

      res.status(HTTPStatusCode.Created).json({
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
          error: `Club with id ${id} not found`,
        });
        return;
      }

      res.status(HTTPStatusCode.OK).json({
        data: updatedClub,
      });
    }
  );

  private deleteById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;
      const deletedTask = await this.service.deleteById(id);

      if (!deletedTask) {
        res.status(HTTPStatusCode.NotFound).json({
          error: `Task with id ${id} not found`,
        });
        return;
      }

      res.status(HTTPStatusCode.OK).json({
        message: "Task deleted successfully",
      });
    }
  );

  loadRoutes(): Router {
    const router = Router();

    router.get("/", this.getList);
    router.get("/:id", this.getById);
    router.post("/", this.postCreate);
    router.patch("/:id", this.patchUpdate);
    router.delete("/:id", this.deleteById);

    return router;
  }
}
