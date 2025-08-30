import express, { Request, Response } from "express";
import { router } from "./router";
import { errorHandler } from "./middlewares/error-handler";
import cors from "cors";
import morgan from "morgan";

export const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/api/v1", router);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    errors: [{ message: `Route ${req.method} ${req.path} not found` }],
  });
});

app.use(errorHandler);
