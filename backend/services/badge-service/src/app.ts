import express from "express";
import badgeRoutes from "./Routes/badge.routes";
import { routes, globalErrorHandler } from "@monitorapp/shared";

const app = express();

app.use(express.json({ limit: "10kb" }));

routes.addHealthCheck(app);
app.use("/", badgeRoutes);
app.use(globalErrorHandler);

export default app;
