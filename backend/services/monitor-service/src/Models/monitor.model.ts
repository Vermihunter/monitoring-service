import { Schema, model, HydratedDocument, Types } from "mongoose";

export interface IMonitor {
  label: string;
  periodicity: number;
  badge_label: string;
  project: Types.ObjectId;
  active: boolean;
  type: String;
  createdAt?: Date;
  updatedAt?: Date;
}

export type MonitorDocument = HydratedDocument<IMonitor>;

const monitorSchema = new Schema<IMonitor>(
  {
    label: {
      type: String,
      unique: true,
      required: [true, "Please provide a label for the monitor"],
    },
    periodicity: {
      type: Number,
      min: 5,
      max: 300,
    },
    badge_label: {
      type: String,
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      enum: ["PingMonitor", "WebsiteMonitor"],
    },
  },
  {
    discriminatorKey: "type",
    timestamps: true,
  },
);

export const Monitor = model<IMonitor>("Monitor", monitorSchema);
