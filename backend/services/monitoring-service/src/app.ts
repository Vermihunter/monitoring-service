import express from "express";
import monitoringRoutes from "./Routes/monitoring.routes";
import {
  addHealthCheck,
  addDefaultMiddlewares,
  globalErrorHandler,
  logger,
} from "@monitorapp/shared";

const app = express();

addDefaultMiddlewares(app, logger);
addHealthCheck(app);
app.use("/", monitoringRoutes);
app.use(globalErrorHandler);

export default app;
