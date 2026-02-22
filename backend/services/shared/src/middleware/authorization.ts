import { Request, Response, NextFunction } from "express";
import AppError from "../error/error";

export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  passwordChangedAt?: Date; // Use the raw data field, not the method
  [key: string]: any; // Allow for extra fields without errors
}

// Extend the Request using this shared interface
export interface AuthenticatedRequest extends Request {
  user?: IAuthUser;
}

export const restrictTo = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403),
      );
    }

    next();
  };
};
