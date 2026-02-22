import { handleWebsiteMonitor } from "./WebsiteMonitor";
import { withResultLogging } from "../Utils/withResultLogging";
import { handlePingMonitor } from "./PingMonitor";
import { MonitorHandlerFn } from "../Types/monitor.types";

export type TMonitorRegistry = Record<string, MonitorHandlerFn>;

export const MonitorRegistry: TMonitorRegistry = {
  PingMonitor: withResultLogging(handlePingMonitor),
  WebsiteMonitor: withResultLogging(handleWebsiteMonitor),
};
