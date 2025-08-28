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

export class UserController {
  constructor(private readonly service: UserService = new UserService()) {}

  private getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await this.service.findAllUsers();
    res.status(HTTPStatusCode.OK).json({
      success: true,
      data: users,
    });
  });

  private registerUser = asyncHandler(
    async (req: Request<{}, {}, IUserCreationAtr>, res: Response) => {
      const user = await this.service.registerUser(req.body);
      res.status(HTTPStatusCode.Created).json({
        success: true,
        data: user,
        message: "User registered successfully",
      });
    }
  );

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

  private loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this.service.loginUser(email, password);

    res.status(HTTPStatusCode.OK).json({
      success: true,
      data: result,
      message: "Login successful",
    });
  });

  loadRoutes() {
    const router = Router();

    // Get all users
    router.get("/", this.getAllUsers);

    // Register new user with validation
    router.post(
      "/register",
      validateRequest(registerUserSchema),
      this.registerUser
    );

    // Login user with validation
    router.post("/login", validateRequest(loginUserSchema), this.loginUser);

    // Get user by ID
    router.get("/:id", this.getUserById);

    // Update user with validation
    router.put("/:id", validateRequest(updateUserSchema), this.updateUser);

    // Delete user
    router.delete("/:id", this.deleteUser);

    return router;
  }
}
