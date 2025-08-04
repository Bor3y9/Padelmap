import dotenv from "dotenv";
import http from "http";
import { app } from "./app";
import mongoose from "mongoose";

dotenv.config();

(async () => {
  if (!process.env.DB_URL) throw new Error("invalid database url");

  mongoose.connect(process.env.DB_URL);

  const server = http.createServer(app);
  const port = process.env.PORT || 3000;

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
})();
