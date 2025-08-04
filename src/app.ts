import express, { NextFunction, Request, Response } from "express";
import { router } from "./router";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";

export const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/v1", router);
app.use(errorHandler);

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});
