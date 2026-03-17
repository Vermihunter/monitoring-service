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
    } else if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    console.log(`Token: ${token}`);

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
    // const userResponse = await userHttpClient.get<any>(
    //   `/${decoded.id}/user-exists`,
    // );
    // console.log(`User response: ${JSON.stringify(userResponse)}`);
    // if (!userResponse || userResponse["status"] === "fail") {
    //   return next(
    //     new AppError(
    //       "The user belonging to this token does no longer exist.",
    //       401,
    //     ),
    //   );
    // }

    // const userAuthResponse = await authHttpClient.get<any>("/me");
    // const user = userResponse["user"];

    // console.log("Full userResponse:", JSON.stringify(userResponse, null, 2));
    // console.log("Extracted user:", user);

    // console.log(
    //   "Full authResponse:",
    //   JSON.stringify(userAuthResponse, null, 2),
    // );
    //console.log("Extracted auth:", user);

    const user = {
      id: decoded.id,
      role: decoded.role,
    };

    // GRANT ACCESS TO PROTECTED ROUTE
    (req as AuthenticatedRequest).user = user;
    res.locals.user = user;
    next();
  },
);

export default protect;
