import { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wrap async route handlers and forward errors to global error middleware
 */
const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>,
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {
    fn(req, res, next).catch(next);
  };
};

export default catchAsync;
