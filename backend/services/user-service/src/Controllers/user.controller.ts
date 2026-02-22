// const sharp = require("sharp");
// const User = require("./../models/userModel");
// const catchAsync = require("./../utils/catchAsync");
// const AppError = require("./../utils/appError");
// const factory = require("./handlerFactory");

import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { IUser, User } from "../Models/user.model";
import { HydratedDocument } from "mongoose";
import { AppError, catchAsync, factory } from "@monitorapp/shared";
//import sharp from "sharp";

interface AuthenticatedRequest extends Request {
  user: HydratedDocument<IUser>;
}

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   }
// });
const multerStorage = multer.memoryStorage();

const multerFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(
      new AppError("Not an image! Please upload only images.", 400) as any,
      false,
    );
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadUserPhoto = upload.single("photo");

export const resizeUserPhoto = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    // await sharp(req.file.buffer)
    //   .resize(500, 500)
    //   .toFormat("jpeg")
    //   .jpeg({ quality: 90 })
    //   .toFile(`public/img/users/${req.file.filename}`);

    next();
  },
);

// const filterObj = (obj, ...allowedFields) => {
//   const newObj = {};
//   Object.keys(obj).forEach((el) => {
//     if (allowedFields.includes(el)) newObj[el] = obj[el];
//   });
//   return newObj;
// };

const filterObj = <T extends object, K extends keyof T>(
  obj: T,
  ...allowedFields: K[]
): Pick<T, K> => {
  const newObj = {} as Pick<T, K>;

  Object.keys(obj).forEach((key) => {
    if (allowedFields.includes(key as K)) {
      newObj[key as K] = obj[key as K];
    }
  });

  return newObj;
};

export const getMe = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  req.params.id = req.user.id;
  next();
};

export const updateMe = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          "This route is not for password updates. Please use /updateMyPassword.",
          400,
        ),
      );
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, "name", "email") as Partial<IUser>;
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      status: "success",
      data: {
        user: updatedUser,
      },
    });
  },
);

export const deleteMe = catchAsync(
  async (req: any, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  },
);

export const createUser = factory.createOne(User);

// catchAsync(async (req: Request, res: Response) => {
//   const { name, email, id } = req.body;
//   const user = await User.create({ name, email, id });

//   res.status(500).json({
//     status: "error",
//     message: "This route is not defined! Please use /signup instead",
//   });
// });

export const getUser = factory.getOne(User);
export const getAllUsers = factory.getAll(User);

// Do NOT update passwords with this!
export const updateUser = factory.updateOne(User);
export const deleteUser = factory.deleteOne(User);
