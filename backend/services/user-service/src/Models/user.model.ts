import {
  Schema,
  model,
  HydratedDocument,
  Query,
  CallbackWithoutResultAndOptionalError,
} from "mongoose";

import validator from "validator";

export interface IUser {
  name: string;
  email: string;
  photo: string;
  active: boolean;
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: {
    type: String,
    default: "default.jpg",
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre(/^find/, function (
  this: Query<any, UserDocument>,
  next: CallbackWithoutResultAndOptionalError,
) {
  this.find({ active: { $ne: false } });
  next();
} as any); // Casting to 'any' here solves the "No overload matches" issue

export const User = model<IUser>("User", userSchema);
