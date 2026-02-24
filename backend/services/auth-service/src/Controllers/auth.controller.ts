import jwt, { SignOptions } from "jsonwebtoken";
import { AppError, catchAsync, HttpClient } from "@monitorapp/shared";
//import Email from "./../utils/email";
import { UserAuth, UserAuthDocument } from "../Models/auth.model";
import { NextFunction, Request, Response } from "express";

const userHttpClient = new HttpClient({
  baseURL: "http://user-service:3000",
});

const { JWT_SECRET, JWT_EXPIRES_IN, JWT_COOKIE_EXPIRES_IN } = process.env;

const signToken = (id: string) => {
  return jwt.sign({ id }, JWT_SECRET!, {
    expiresIn: JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });
};

const createSendToken = (
  user: UserAuthDocument,
  statusCode: number,
  req: Request,
  res: Response,
) => {
  const token = signToken(String(user._id));
  const cookieExpiresIn = Number(JWT_COOKIE_EXPIRES_IN) || 30;

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + cookieExpiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
  });

  // Remove password from output
  (user as any).password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userAuth = await UserAuth.create({
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    if (!userAuth) {
      console.error();
      return next(new AppError("Problem with creating users", 400));
    }
    let user: any;
    try {
      user = await userHttpClient.post("/", {
        _id: userAuth.id,
        name: req.body.name,
      });
    } catch (err: any) {
      return next(new AppError(err.message, 201));
    }
    createSendToken(userAuth, 201, req, res);
  },
);

export const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    const userAuth = await UserAuth.findOne({
      email: email,
    }).select("+password");

    if (userAuth) {
      console.log(
        `Password: ${password} + userAuth.password: ${userAuth.password}`,
      );
    }
    if (
      !userAuth ||
      !(await userAuth.correctPassword(password, userAuth.password))
    ) {
      return next(new AppError("Incorrect email or password", 401));
    }

    (userAuth as any).password = undefined;

    // 3) If everything ok, send token to client
    createSendToken(userAuth, 200, req, res);
  },
);

export const logout = (req: Request, res: Response) => {
  res.cookie("jwt", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: "success" });
};

// Only for rendered pages, no errors!
// export const isLoggedIn = async (
//   req: Request,
//   res: Response,
//   next: NextFunction,
// ) => {
//   if (req.cookies.jwt) {
//     try {
//       // 1) verify token
//       const decoded = await promisify(jwt.verify)(
//         req.cookies.jwt,
//         process.env.JWT_SECRET,
//       );

//       // 2) Check if user still exists
//       const currentUser = await User.findById(decoded.id);
//       if (!currentUser) {
//         return next();
//       }

//       // 3) Check if user changed password after the token was issued
//       if (currentUser.changedPasswordAfter(decoded.iat)) {
//         return next();
//       }

//       // THERE IS A LOGGED IN USER
//       res.locals.user = currentUser;
//       return next();
//     } catch (err) {
//       return next();
//     }
//   }
//   next();
// };

// exports.forgotPassword = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // 1) Get user based on POSTed email
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return next(new AppError("There is no user with email address.", 404));
//     }

//     // 2) Generate the random reset token
//     const resetToken = user.createPasswordResetToken();
//     await user.save({ validateBeforeSave: false });

//     // 3) Send it to user's email
//     try {
//       const resetURL = `${req.protocol}://${req.get(
//         "host",
//       )}/api/v1/users/resetPassword/${resetToken}`;
//       await new Email(user, resetURL).sendPasswordReset();

//       res.status(200).json({
//         status: "success",
//         message: "Token sent to email!",
//       });
//     } catch (err) {
//       user.passwordResetToken = undefined;
//       user.passwordResetExpires = undefined;
//       await user.save({ validateBeforeSave: false });

//       return next(
//         new AppError("There was an error sending the email. Try again later!"),
//         500,
//       );
//     }
//   },
// );

// exports.resetPassword = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // 1) Get user based on the token
//     const hashedToken = crypto
//       .createHash("sha256")
//       .update(req.params.token)
//       .digest("hex");

//     const user = await User.findOne({
//       passwordResetToken: hashedToken,
//       passwordResetExpires: { $gt: Date.now() },
//     });

//     // 2) If token has not expired, and there is user, set the new password
//     if (!user) {
//       return next(new AppError("Token is invalid or has expired", 400));
//     }
//     user.password = req.body.password;
//     user.passwordConfirm = req.body.passwordConfirm;
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save();

//     // 3) Update changedPasswordAt property for the user
//     // 4) Log the user in, send JWT
//     createSendToken(user, 200, req, res);
//   },
// );

// exports.updatePassword = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     // 1) Get user from collection
//     const user = await User.findById(req.user.id).select("+password");

//     // 2) Check if POSTed current password is correct
//     if (
//       !(await user.correctPassword(req.body.passwordCurrent, user.password))
//     ) {
//       return next(new AppError("Your current password is wrong.", 401));
//     }

//     // 3) If so, update password
//     user.password = req.body.password;
//     user.passwordConfirm = req.body.passwordConfirm;
//     await user.save();
//     // User.findByIdAndUpdate will NOT work as intended!

//     // 4) Log user in, send JWT
//     createSendToken(user, 200, req, res);
//   },
// );
