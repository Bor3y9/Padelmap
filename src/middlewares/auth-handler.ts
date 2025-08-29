import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction, Router } from "express";
import { AuthenticationError } from "../common/errors";
import { UserModel } from "../models/user.model";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export class AuthHandler {
  constructor() {}

  protect = expressAsyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      let token: string | undefined;

      // Check if authorization header exists and starts with Bearer
      if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
      }

      if (!token) {
        return next(
          new AuthenticationError(
            "You are not logged in! Please log in to get access."
          )
        );
      }

      try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
          id: string;
          iat: number;
        };


        // Check if user still exists
        const currentUser = await UserModel.findById(decoded.id);

        if (!currentUser) {
          return next(
            new AuthenticationError(
              "The user belonging to this token does no longer exist."
            )
          );
        }

        // Add user to request object
        req.user = currentUser;
        console.log("User added to request:", req.user);
        next();
      } catch (error) {
        console.log("JWT verification error:", error);
        return next(
          new AuthenticationError("Invalid token. Please log in again.")
        );
      }
    }
  );
}
