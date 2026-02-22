import { IMonitor, Monitor } from "./monitor.model";
import { Schema } from "mongoose";

export interface IPingMonitor extends IMonitor {
  port: string;
  hostname: string;
}

const pingMonitorSchema = new Schema<IPingMonitor>({
  port: {
    type: String,
    required: true,
  },
  hostname: {
    type: String,
    required: true,
  },
});

export const PingMonitor = Monitor.discriminator<IPingMonitor>(
  "PingMonitor",
  pingMonitorSchema,
);
