import crypto from "crypto";
import bcrypt from "bcrypt";
import mongoose, { Schema, HydratedDocument } from "mongoose";
import { UserRole } from "./user.roles";
import { AppError } from "@monitorapp/shared";

export interface IUserAuth {
  role: string;
  password: string;
  passwordConfirm: string;
  passwordChangedAt: Date;
  passwordResetToken: String;
  passwordResetExpires: Date;
}

export type UserAuthDocument = HydratedDocument<IUserAuth>;

const userAuthSchema = new Schema<IUserAuth>({
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.USER,
    required: [true, "A user must have a role"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      // This only works on CREATE and SAVE!!!
      validator: function (el: string) {
        return el === (this as any).password;
      },
      message: "Passwords are not the same!",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
});

userAuthSchema.pre("save", async function () {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) {
    throw new AppError("The password is not modified", 400);
  }
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  (this as any).passwordConfirm = undefined;
});

userAuthSchema.pre("save", function () {
  if (!this.isModified("password") || this.isNew) {
    return;
  }

  this.passwordChangedAt = new Date(Date.now() - 1000);
});

userAuthSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userAuthSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000,
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userAuthSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export const UserAuth = mongoose.model("UserAuth", userAuthSchema);
