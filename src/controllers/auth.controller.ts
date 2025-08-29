import { HTTPStatusCode } from "../common/enums";
import { IUserCreationAtr } from "../common/interfaces";
import {
  registerUserSchema,
  loginUserSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../common/validation";
import { AuthService } from "../services/auth.service";
import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { validateRequest } from "../middlewares/validation.middleware";
import { AuthHandler } from "../middlewares/auth-handler";

export class AuthController {
  private authHandler = new AuthHandler();

  constructor(private readonly service: AuthService = new AuthService()) {}

  private registerUser = asyncHandler(
    async (req: Request<{}, {}, IUserCreationAtr>, res: Response) => {
      const result = await this.service.registerUser(req.body);
      res.status(HTTPStatusCode.Created).json({
        success: true,
        data: result.user,
        token: result.token,
        message: result.message,
      });
    }
  );

  private loginUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const result = await this.service.loginUser(email, password);

    res.status(HTTPStatusCode.OK).json({
      success: true,
      data: result.user,
      token: result.token,
      message: result.message,
    });
  });

  private refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id; // From auth middleware
    const result = await this.service.refreshToken(userId);

    res.status(HTTPStatusCode.OK).json({
      success: true,
      token: result.token,
      message: result.message,
    });
  });

  private changePassword = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user._id; 
    const { currentPassword, newPassword } = req.body;
    const result = await this.service.changePassword(
      userId,
      currentPassword,
      newPassword
    );

    res.status(HTTPStatusCode.OK).json({
      success: true,
      message: result.message,
    });
  });

  private forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await this.service.forgotPassword(email);

    res.status(HTTPStatusCode.OK).json({
      success: true,
      message: result.message,
      // Remove resetToken in production
      ...(result.resetToken && { resetToken: result.resetToken }),
    });
  });

  private resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { resetToken, newPassword } = req.body;
    const result = await this.service.resetPassword(resetToken, newPassword);

    res.status(HTTPStatusCode.OK).json({
      success: true,
      message: result.message,
    });
  });

  private getProfile = asyncHandler(async (req: Request, res: Response) => {
    // Return user profile (user is already attached by auth middleware)
    const { password, ...userProfile } = req.user.toObject();

    res.status(HTTPStatusCode.OK).json({
      success: true,
      data: userProfile,
    });
  });

  loadRoutes() {
    const router = Router();

    // Public routes (no authentication required)
    router.post(
      "/register",
      validateRequest(registerUserSchema),
      this.registerUser
    );
    router.post("/login", validateRequest(loginUserSchema), this.loginUser);
    router.post(
      "/forgot-password",
      validateRequest(forgotPasswordSchema),
      this.forgotPassword
    );
    router.post(
      "/reset-password",
      validateRequest(resetPasswordSchema),
      this.resetPassword
    );

    // Protected routes (authentication required)
    router.post("/refresh-token", this.authHandler.protect, this.refreshToken);
    router.post(
      "/change-password",
      this.authHandler.protect,
      validateRequest(changePasswordSchema),
      this.changePassword
    );
    router.get("/profile", this.authHandler.protect, this.getProfile);

    return router;
  }
}
