import { Application } from "express";

export default function addHealthCheck(app: Application) {
  app.get("/healthz", (_, res) => {
    res.json({ ok: true });
  });
}
