import { Schema, model, HydratedDocument, Types } from "mongoose";

export interface IMonitorDailyStat {
  day: Date;
  monitor: Types.ObjectId;

  successCount: number;
  failureCount: number;

  responseTimeCount: number;
  responseTimeSum: number;
  responseTimeAvg: number | null;
  responseTimeMin: number | null;
  responseTimeMax: number | null;

  generatedAt: Date;
}

export type MonitorDailyStatDocument = HydratedDocument<IMonitorDailyStat>;

const monitorDailyStatSchema = new Schema<IMonitorDailyStat>(
  {
    day: { type: Date, required: true },
    monitor: {
      type: Schema.Types.ObjectId,
      ref: "Monitor",
      required: true,
    },

    successCount: { type: Number, default: 0, required: true },
    failureCount: { type: Number, default: 0, required: true },

    responseTimeCount: { type: Number, default: 0, required: true },
    responseTimeSum: { type: Number, default: 0, required: true },
    responseTimeAvg: { type: Number, default: null },
    responseTimeMin: { type: Number, default: null },
    responseTimeMax: { type: Number, default: null },

    generatedAt: { type: Date, default: Date.now, required: true },
  },
  { timestamps: true },
);

monitorDailyStatSchema.index({ day: 1, monitor: 1 }, { unique: true });
monitorDailyStatSchema.index({ monitor: 1, day: 1 });

export const MonitorDailyStat = model<IMonitorDailyStat>(
  "MonitorDailyStat",
  monitorDailyStatSchema,
);
