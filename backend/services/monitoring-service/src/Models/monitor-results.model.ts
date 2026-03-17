import { Schema, model, HydratedDocument, Types } from "mongoose";

export enum MonitorResultStatus {
  FAILED = "failed",
  SUCCESS = "success",
  IN_PROGRESS = "in-progress",
}

export interface IMonitorResult {
  start: Date;
  status: MonitorResultStatus;
  monitor: Types.ObjectId;
  responseInMs?: number | null;
  errorMessage?: string | null;
}

export type MonitorDocument = HydratedDocument<IMonitorResult>;

const monitorResultSchema = new Schema<IMonitorResult>(
  {
    start: {
      type: Date,
      required: true,
      default: Date.now,
    },

    status: {
      type: String,
      enum: Object.values(MonitorResultStatus),
      required: true,
    },

    monitor: {
      type: Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
    },

    responseInMs: {
      type: Number,
      required: false,
      default: null,
    },

    errorMessage: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export const MonitorResult = model<IMonitorResult>(
  "MonitorResult",
  monitorResultSchema,
);
