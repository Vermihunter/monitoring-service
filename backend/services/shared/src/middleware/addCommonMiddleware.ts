import express, { Application } from "express";
import cookieParser from "cookie-parser";
// import mongoSanitize from "express-mongo-sanitize";
import createHttpLogger from "../logging/httpLogger";

export default function addDefaultMiddlewares(app: Application, logger: any) {
  app.use(express.json({ limit: "10kb" }));
  app.use(createHttpLogger(logger));
  app.use(cookieParser());
  // app.use(mongoSanitize());
}
