import { IMonitor, Monitor } from "./monitor.model";
import { Schema } from "mongoose";

export interface IWebsiteMonitor extends IMonitor {
  url: string;
  check_status: boolean;
  keywords: [string];
}

const websiteMonitorSchema = new Schema<IWebsiteMonitor>({
  url: {
    type: String,
    required: true,
  },
  check_status: {
    type: Boolean,
    default: true,
  },
  keywords: {
    type: [String],
    default: [],
  },
});

export const WebsiteMonitor = Monitor.discriminator<IWebsiteMonitor>(
  "WebsiteMonitor",
  websiteMonitorSchema,
);
