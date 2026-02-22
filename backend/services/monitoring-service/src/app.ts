import express from "express";
import monitoringRoutes from "./Routes/monitoring.routes";
import { routes, globalErrorHandler } from "@monitorapp/shared";

const app = express();

app.use(express.json({ limit: "10kb" }));

routes.addHealthCheck(app);
app.use("/", monitoringRoutes);
app.use(globalErrorHandler);

export default app;
