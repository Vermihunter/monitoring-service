import pinoHttp from "pino-http";
import crypto from "crypto";

import { Request, Response } from "express";

export default function createHttpLogger(logger: any) {
  return pinoHttp({
    logger,

    genReqId: (req: Request) =>
      req.headers["x-request-id"] || crypto.randomUUID(),

    customLogLevel: (req: Request, res: Response, err: any) => {
      if (res.statusCode >= 500 || err) return "error";
      if (res.statusCode >= 400) return "warn";
      return "info";
    },
  });
}
