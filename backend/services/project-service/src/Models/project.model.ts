import { Schema, model, HydratedDocument, Types } from "mongoose";

export interface IProject {
  label: string;
  description: string;
  tags: [string];
  user: Types.ObjectId;
  monitors: Types.ObjectId[];
}

export type UserDocument = HydratedDocument<IProject>;

const projectSchema = new Schema<IProject>({
  label: {
    type: String,
    unique: true,
    required: [true, "Please provide a label for the project"],
  },

  description: {
    type: String,
    required: [true, "Please provide a description for the project"],
  },

  tags: {
    type: [String],
    default: [],
  },

  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Every project must belong to a user"],
  },

  monitors: [
    {
      type: Schema.Types.ObjectId,
      ref: "Monitor",
    },
  ],
});

export const Project = model<IProject>("Project", projectSchema);
