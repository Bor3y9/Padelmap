import { HTTPStatusCode } from "../common/enums";
import { IUserCreationAtr, IUserAtr } from "../common/interfaces";
import {
  registerUserSchema,
  updateUserSchema,
  loginUserSchema,
} from "../common/validation";
import { NotFoundError } from "../common/errors";
import { UserService } from "../services/user.service";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { validateRequest } from "../middlewares/validation.middleware";
import { AuthHandler } from "../middlewares/auth-handler";

export class UserController {
  private authHandler = new AuthHandler();

  constructor(private readonly service: UserService = new UserService()) {}

  private getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.service.findAllUsers();
    res.status(HTTPStatusCode.OK).json({
      success: true,
      data: users,
    });
  });

  private getUserById = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;
      const user = await this.service.findUserById(id);

      if (!user) {
        throw new NotFoundError("User not found");
      }

      res.status(HTTPStatusCode.OK).json({
        success: true,
        data: user,
      });
    }
  );

  private updateUser = asyncHandler(
    async (req: Request<{ id: string }>, res: Response) => {
      const { id } = req.params;
      const updatedUser = await this.service.updateUser(id, req.body);

      res.status(HTTPStatusCode.OK).json({
        success: true,
        data: updatedUser,
        message: "User updated successfully",
      });
    }
  );

  private deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.service.deleteUser(id);

    res.status(HTTPStatusCode.OK).json({
      success: true,
      message: "User deleted successfully",
    });
  });
  loadRoutes() {
    const router = Router();

    router.get("/", this.authHandler.protect, this.getAllUsers);
    router.get("/:id", this.authHandler.protect, this.getUserById);
    router.put(
      "/:id",
      this.authHandler.protect,
      validateRequest(updateUserSchema),
      this.updateUser
    );
    router.delete("/:id", this.authHandler.protect, this.deleteUser);

    return router;
  }
}
