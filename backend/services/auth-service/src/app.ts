import express from "express";
import authRoutes from "./Routes/auth.routes";
import { globalErrorHandler } from "@monitorapp/shared";

const app = express();

app.use(express.json({ limit: "10kb" }));

app.get("/healthz", (_, res) => {
  res.json({ ok: true });
});

app.use("/", authRoutes);

app.use(globalErrorHandler);

export default app;
