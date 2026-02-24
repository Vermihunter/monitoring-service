import { Application } from "express";
import AppError from "../error/error";

export default function addDefaultErrorRoutes(app: Application) {
  app.all("*", (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });
}
