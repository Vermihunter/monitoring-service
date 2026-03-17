import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { HttpError } from "../lib/errors.js";
import { MonitorResultStatus } from "../models/MonitorResult.js";

function isValidDate(value: unknown): boolean {
  if (typeof value !== "string" && !(value instanceof Date)) {
    return false;
  }
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

function isFiniteNumber(value: unknown): boolean {
  return typeof value === "number" && Number.isFinite(value);
}

function parseCreateBody(body: any) {
  if (!body || typeof body !== "object") {
    throw new HttpError(400, "Body must be a JSON object");
  }

  if (!Types.ObjectId.isValid(body.monitor)) {
    throw new HttpError(400, "Invalid monitor id");
  }

  if (!Object.values(MonitorResultStatus).includes(body.status)) {
    throw new HttpError(400, "Invalid status");
  }

  if (body.start !== undefined && !isValidDate(body.start)) {
    throw new HttpError(400, "Invalid start date");
  }

  if (
    body.responseInMs !== undefined &&
    body.responseInMs !== null &&
    !isFiniteNumber(body.responseInMs)
  ) {
    throw new HttpError(400, "responseInMs must be a finite number or null");
  }

  if (
    body.errorMessage !== undefined &&
    body.errorMessage !== null &&
    typeof body.errorMessage !== "string"
  ) {
    throw new HttpError(400, "errorMessage must be a string or null");
  }

  return {
    monitor: new Types.ObjectId(body.monitor),
    status: body.status as MonitorResultStatus,
    start: body.start ? new Date(body.start) : new Date(),
    responseInMs: body.responseInMs !== undefined ? body.responseInMs : null,
    errorMessage: body.errorMessage !== undefined ? body.errorMessage : null,
  };
}

function parsePatchBody(body: any) {
  if (!body || typeof body !== "object") {
    throw new HttpError(400, "Body must be a JSON object");
  }

  const out: Record<string, unknown> = {};

  if ("monitor" in body) {
    if (!Types.ObjectId.isValid(body.monitor)) {
      throw new HttpError(400, "Invalid monitor id");
    }
    out.monitor = new Types.ObjectId(body.monitor);
  }

  if ("status" in body) {
    if (!Object.values(MonitorResultStatus).includes(body.status)) {
      throw new HttpError(400, "Invalid status");
    }
    out.status = body.status;
  }

  if ("start" in body) {
    if (!isValidDate(body.start)) {
      throw new HttpError(400, "Invalid start date");
    }
    out.start = new Date(body.start);
  }

  if ("responseInMs" in body) {
    if (body.responseInMs !== null && !isFiniteNumber(body.responseInMs)) {
      throw new HttpError(400, "responseInMs must be a finite number or null");
    }
    out.responseInMs = body.responseInMs;
  }

  if ("errorMessage" in body) {
    if (body.errorMessage !== null && typeof body.errorMessage !== "string") {
      throw new HttpError(400, "errorMessage must be a string or null");
    }
    out.errorMessage = body.errorMessage;
  }

  if (Object.keys(out).length === 0) {
    throw new HttpError(400, "Patch body must contain at least one field");
  }

  return out;
}

export function validateObjectIdParam(paramName: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!Types.ObjectId.isValid(req.params[paramName])) {
      return next(new HttpError(400, `Invalid ${paramName}`));
    }
    next();
  };
}

export function validateCreateMonitorResult(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    req.body = parseCreateBody(req.body);
    next();
  } catch (err) {
    next(err);
  }
}

export function validatePatchMonitorResult(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  try {
    req.body = parsePatchBody(req.body);
    next();
  } catch (err) {
    next(err);
  }
}
