import express from "express";
import userRoutes from "./Routes/user.routes";
import {
  addHealthCheck,
  addDefaultMiddlewares,
  globalErrorHandler,
  logger,
} from "@monitorapp/shared";

const app = express();

addDefaultMiddlewares(app, logger);
addHealthCheck(app);
app.use("/", userRoutes);

app.use(globalErrorHandler);

export default app;
