import { Request, Response, NextFunction } from "express";
import AppError from "./error";

/**
 * Extend the base Error type to include custom fields
 */
interface AppErrorType extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
  code?: number;
  path?: string;
  value?: string;
  errmsg?: string;
  errors?: Record<string, { message: string }>;
}

// ======================
// DB ERROR HANDLERS
// ======================

const handleCastErrorDB = (err: AppErrorType): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: AppErrorType): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err: AppErrorType): AppError => {
  const errors = Object.values(err.errors || {}).map((el) => el.message);

  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

const handleJWTError = (): AppError =>
  new AppError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = (): AppError =>
  new AppError("Your token has expired! Please log in again.", 401);

// ======================
// SEND ERROR (DEV)
// ======================

const sendErrorDev = (
  err: AppErrorType,
  req: Request,
  res: Response,
): Response => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode || 500).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  console.error("ERROR 💥", err);

  return res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

  // return res.status(err.statusCode || 500).render("error", {
  //   title: "Something went wrong!",
  //   msg: err.message,
  // });
};

// ======================
// SEND ERROR (PROD)
// ======================

const sendErrorProd = (
  err: AppErrorType,
  req: Request,
  res: Response,
): Response => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode || 500).json({
        status: err.status,
        message: err.message,
      });
    }

    console.error("ERROR 💥", err);

    return res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }

  return res.status(err.statusCode || 500).json({
    msg: err.message,
    title: "Something went wrong",
  });

  // if (err.isOperational) {
  //   return res.status(err.statusCode || 500).render("error", {
  //     title: "Something went wrong!",
  //     msg: err.message,
  //   });
  // }

  // console.error("ERROR 💥", err);

  // return res.status(err.statusCode || 500).render("error", {
  //   title: "Something went wrong!",
  //   msg: "Please try again later.",
  // });
};

// ======================
// GLOBAL ERROR MIDDLEWARE
// ======================

export default (
  err: AppErrorType,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error: AppErrorType = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);

    if (error.name === "JsonWebTokenError") error = handleJWTError();

    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
