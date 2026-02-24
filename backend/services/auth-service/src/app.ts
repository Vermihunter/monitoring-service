import express from "express";
import authRoutes from "./Routes/auth.routes";
import {
  addHealthCheck,
  globalErrorHandler,
  addDefaultMiddlewares,
  logger,
} from "@monitorapp/shared";

const app = express();

addDefaultMiddlewares(app, logger);
addHealthCheck(app);

app.use("/", authRoutes);

app.use(globalErrorHandler);

export default app;
