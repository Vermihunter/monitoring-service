import { Request, Response, NextFunction } from "express";
import { Monitor, MonitorDocument } from "../Models/monitor.model";
import { catchAsync, AppError, factory } from "@monitorapp/shared";
import { eventQueue } from "../Queue/queue";
import { PingMonitor } from "../Models/ping-monitor.model";
import { WebsiteMonitor } from "../Models/website-monitor.model";

async function getMonitorFromDB(id: string) {
  const monitor = await Monitor.findById(id);

  if (!monitor) {
    throw new AppError("No monitor with such ID exists", 400);
  }

  return monitor;
}

function queueIdForMonitor(monitor: MonitorDocument) {
  return `monitor-${monitor.id}`;
}

export const startMonitor = catchAsync(async (req: Request, res: Response) => {
  console.log(`Starting monitor: ${req.params.id}`);
  const monitor = await getMonitorFromDB(String(req.params.id));
  const monitorObj = monitor.toObject();

  const {
    periodicity,
    active,
    project,
    _id, // Mongoose internal ID
    __v, // Version key
    createdAt, // Timestamp
    updatedAt, // Timestamp
    ...queueData // Everything else remains here
  } = monitorObj as any;

  const job = await eventQueue.upsertJobScheduler(
    queueIdForMonitor(monitor),
    {
      every: monitor.periodicity * 1000,
    },
    {
      name: "monitoring",
      data: { ...queueData, monitorId: monitor.id },
      opts: {},
    },
  );

  res.json({ job: job });
});

export const cancelMonitor = catchAsync(async (req: Request, res: Response) => {
  console.log(`Canceling monitor: ${req.params.id}`);
  const monitor = await getMonitorFromDB(String(req.params.id));

  const result = await eventQueue.removeJobScheduler(
    queueIdForMonitor(monitor),
  );

  if (!result) {
    throw new AppError("Cannot cancel monitor - Missing Job Scheduler", 400);
  }

  res.status(200).json({ status: "success" });
});

export const getAllMonitors = factory.getAll(Monitor);
export const getMonitor = factory.getOneMicroservices(Monitor, undefined, [
  {
    path: "project",
    endpoint: "http://project-service:3000/",
  },
]);

export const createPingMonitor = factory.createOne(PingMonitor);
export const createWebsiteMonitor = factory.createOne(WebsiteMonitor);
export const updateMonitor = factory.updateOne(Monitor);
export const deleteMonitor = factory.deleteOne(Monitor);
