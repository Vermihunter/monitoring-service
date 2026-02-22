// The data shape coming out of BullMQ
export interface IMonitorJobData {
  id: string; // The MongoDB ID of the Monitor
  type: "PingMonitor" | "WebsiteMonitor";
  label: string;
  url?: string;
  host?: string;
  port?: number;
  checkStatus?: boolean;
  keywords?: string[];
  [key: string]: any;
}

// The signature for a logic handler
export type MonitorHandlerFn = (data: IMonitorJobData) => Promise<void>;
