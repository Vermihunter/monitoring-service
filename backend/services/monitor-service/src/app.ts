import express from "express";
import monitorRoutes from "./Routes/monitor.routes";
import { routes, globalErrorHandler } from "@monitorapp/shared";

const app = express();

app.use(express.json({ limit: "10kb" }));

routes.addHealthCheck(app);
app.use("/", monitorRoutes);
app.use(globalErrorHandler);

export default app;
