import { HTTPStatusCode } from "../common/enums";
import { ITaskAtr, ITaskCreationAtr } from "../common/interfaces";
import { TaskService } from "../services/task.service";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";

export class TaskController {
  constructor(private readonly service: TaskService = new TaskService()) {}

  private getList = asyncHandler(async (req: Request, res: Response) => {
    const tasks = await this.service.list();

    res.status(HTTPStatusCode.OK).json({
      data: tasks,
    });
  });

  private getById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;
      const task = await this.service.getById(id);

      if (!task) {
        res.status(HTTPStatusCode.NotFound).json({
          error: `Task with id ${id} not found`,
        });
        return;
      }

      res.status(HTTPStatusCode.OK).json({
        data: task,
      });
    }
  );

  private postCreate = asyncHandler(
    async (req: Request<{}, {}, ITaskCreationAtr>, res: Response) => {
      const newTask = await this.service.createOne(req.body);
      if (!newTask) {
        res.status(HTTPStatusCode.BadRequest).json({
          error: "Failed to create task",
        });
        return;
      }

      res.status(HTTPStatusCode.Created).json({
        data: newTask,
      });
    }
  );

  private patchUpdate = asyncHandler(
    async (
      req: Request<{ id: string }, {}, Partial<ITaskAtr>>,
      res: Response
    ) => {
      const { id } = req.params;
      const updatedTask = await this.service.updateById(id, req.body);

      if (!updatedTask) {
        res.status(HTTPStatusCode.NotFound).json({
          error: `Task with id ${id} not found`,
        });
        return;
      }

      res.status(HTTPStatusCode.OK).json({
        data: updatedTask,
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
