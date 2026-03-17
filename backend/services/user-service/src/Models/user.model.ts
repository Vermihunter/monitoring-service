import mongoose, {
  Schema,
  model,
  HydratedDocument,
  Query,
  Types,
} from "mongoose";

export interface IUser {
  name: string;
  photo: string;
  active: boolean;
  projects: Types.ObjectId[];
}

export type UserDocument = HydratedDocument<IUser>;

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, "Please tell us your name!"],
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

  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
  ],
});

userSchema.pre(/^find/, function (this: Query<any, UserDocument>) {
  console.log(`INSTANCE: ${this instanceof mongoose.Query}`);
  this.find({ active: { $ne: false } });
} as any); // Casting to 'any' here solves the "No overload matches" issue

export const User = model<IUser>("User", userSchema);
