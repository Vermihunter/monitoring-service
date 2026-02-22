import express from "express";
import userRoutes from "./Routes/user.routes";
import { routes, globalErrorHandler } from "@monitorapp/shared";

const app = express();

app.use(express.json({ limit: "10kb" }));

routes.addHealthCheck(app);
app.use("/", userRoutes);

app.use(globalErrorHandler);

export default app;
