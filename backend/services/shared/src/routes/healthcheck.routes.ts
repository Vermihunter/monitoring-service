import { Application } from "express";

export const addHealthCheck = (app: Application) => {
  app.get("/healthz", (_, res) => {
    res.json({ ok: true });
  });
};
