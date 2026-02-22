import { Schema, model, HydratedDocument } from "mongoose";

export interface IProject {
  label: string;
  description: string;
  tags: [string];
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
});

export const Project = model<IProject>("Project", projectSchema);
