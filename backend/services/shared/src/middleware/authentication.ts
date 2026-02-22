import { Request, Response, NextFunction } from "express";
import AppError from "../error/error";
import { HttpClient } from "../http/httpClient";
import catchAsync from "./catchAsync";
import { promisify } from "node:util";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "./authorization";

// 1. Define what the JWT contains
// interface DecodedToken extends JwtPayload {
//   id: string;
//   iat: number;
// }

const userHttpClient = new HttpClient({
  baseURL: "http://user-service:3000",
});

const authHttpClient = new HttpClient({
  baseURL: "http://auth-service:3000",
});

const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // else if (req.cookies.jwt) {
    //   token = req.cookies.jwt;
    // }

    if (!token) {
      return next(
        new AppError(
          "You are not logged in! Please log in to get access.",
          401,
        ),
      );
    }

    // 2) Verification token
    const decoded = await promisify<string, string, any>(jwt.verify)(
      token,
      process.env.JWT_SECRET!,
    );

    // 3) Check if user still exists
    //const currentUser = await User.findById(decoded.id);
    const currentUser = await userHttpClient.get<any>(`/${decoded.id}`);
    if (!currentUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401,
        ),
      );
    }

    const currentAuthDetails = await authHttpClient.get<any>(`/${decoded.id}`);
    // 4) Check if user changed password after the token was issued
    if (
      !currentAuthDetails ||
      currentAuthDetails.changedPasswordAfter(decoded.iat)
    ) {
      return next(
        new AppError(
          "User recently changed password! Please log in again.",
          401,
        ),
      );
    }

    const user = { ...currentUser };

    // GRANT ACCESS TO PROTECTED ROUTE
    (req as AuthenticatedRequest).user = user;
    res.locals.user = user;
    next();
  },
);

export default protect;
