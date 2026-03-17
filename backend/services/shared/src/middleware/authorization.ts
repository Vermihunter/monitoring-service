import { Request, Response, NextFunction } from "express";
import AppError from "../error/error";

export interface IAuthUser {
  id: string;
  role: string;
}

// Extend the Request using this shared interface
export interface AuthenticatedRequest extends Request {
  user: IAuthUser;
}

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Cast it here to access your custom properties
    const authReq = req as AuthenticatedRequest;

    if (!roles.includes(authReq.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }

    next();
  };
};
