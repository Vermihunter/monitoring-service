import express from "express";
import monitorRoutes from "./Routes/monitor.routes";
import {
  addHealthCheck,
  addDefaultMiddlewares,
  globalErrorHandler,
  logger,
} from "@monitorapp/shared";

const app = express();

addDefaultMiddlewares(app, logger);
addHealthCheck(app);
app.use("/", monitorRoutes);
app.use(globalErrorHandler);

export default app;
