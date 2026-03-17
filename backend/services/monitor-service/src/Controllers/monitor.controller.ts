import { Request, Response, NextFunction } from "express";
import { Monitor } from "../Models/monitor.model";
import { catchAsync, AppError, factory } from "@monitorapp/shared";

import { PingMonitor } from "../Models/ping-monitor.model";
import { WebsiteMonitor } from "../Models/website-monitor.model";
import {
  cancelMonitorService,
  startMonitorService,
} from "../Service/monitor.service";

async function getMonitorFromDB(id: string) {
  const monitor = await Monitor.findById(id);

  if (!monitor) {
    throw new AppError("No monitor with such ID exists", 400);
  }

  return monitor;
}

export const startMonitor = catchAsync(async (req: Request, res: Response) => {
  console.log(`Starting monitor: ${req.params.id}`);

  const monitor = await getMonitorFromDB(String(req.params.id));

  const result = await startMonitorService(monitor);

  res.status(200).json(result);
});

export const cancelMonitor = catchAsync(async (req: Request, res: Response) => {
  console.log(`Canceling monitor: ${req.params.id}`);

  const monitor = await getMonitorFromDB(String(req.params.id));

  const result = await cancelMonitorService(monitor);

  res.status(200).json(result);
});

export const updateMonitor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const oldMonitor = await Monitor.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: false, runValidators: true },
    );

    if (!oldMonitor) {
      return;
    }

    const newActive =
      req.body.active !== undefined ? req.body.active : oldMonitor.active;

    console.log("Old monitor: ", newActive, " - ", oldMonitor.active);
    if (oldMonitor.active !== newActive) {
      console.log("Activating: ", String(newActive));

      let res;
      if (newActive) {
        res = await startMonitorService(oldMonitor);
      } else {
        res = await cancelMonitorService(oldMonitor);
      }

      console.log(res);
    }
  },
);

export const getAllMonitors = factory.getAll(Monitor);
export const getMonitor = factory.getOneMicroservices(Monitor, undefined, [
  {
    path: "project",
    endpoint: "http://project-service:3000/",
  },
]);

export const createPingMonitor = factory.createOne(PingMonitor);
export const createWebsiteMonitor = factory.createOne(WebsiteMonitor);
export const deleteMonitor = factory.deleteOne(Monitor);
