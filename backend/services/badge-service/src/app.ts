import express from "express";
import badgeRoutes from "./Routes/badge.routes";
import {
  addHealthCheck,
  addDefaultMiddlewares,
  globalErrorHandler,
  logger,
} from "@monitorapp/shared";

const app = express();

addDefaultMiddlewares(app, logger);
addHealthCheck(app);

app.use("/", badgeRoutes);
app.use(globalErrorHandler);

export default app;
