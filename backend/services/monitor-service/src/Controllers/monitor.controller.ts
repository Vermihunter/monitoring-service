import { Request, Response, NextFunction } from "express";
import { Monitor } from "../Models/monitor.model";
import { catchAsync, AppError, factory, HttpClient } from "@monitorapp/shared";
import { Model } from "mongoose";

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

async function updateConcreteMonitor<T>(Model: Model<T>, req: Request) {
  return await PingMonitor.findOneAndUpdate({ _id: req.params.id }, req.body, {
    new: false,
    runValidators: true,
  });
}

export const updateMonitor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const existingMonitor = await Monitor.findById(req.params.id);

    if (!existingMonitor) {
      return res.status(404).json({
        status: "fail",
        message: "Monitor not found",
      });
    }

    let newMonitor;

    // const oldMonitor = existingMonitor.type === "PingMonitor"
    //   ? updateConcreteMonitor(PingMonitor, req)
    //   : updateConcreteMonitor(WebsiteMonitor, req);

    if (existingMonitor.type === "PingMonitor") {
      newMonitor = await PingMonitor.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true },
      );
    } else {
      newMonitor = await WebsiteMonitor.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        { new: true, runValidators: true },
      );
    }
    if (!newMonitor) {
      return res.status(404).json({
        status: "fail",
        message: "Monitor not found",
      });
    }

    const newActive =
      req.body.active !== undefined ? req.body.active : existingMonitor.active;

    console.log("Old monitor: ", newActive, " - ", existingMonitor.active);
    if (existingMonitor.active !== newActive) {
      console.log("Activating: ", String(newActive));

      let res;
      if (newActive) {
        res = await startMonitorService(existingMonitor);
      } else {
        res = await cancelMonitorService(existingMonitor);
      }

      console.log(res);
    }

    console.log("exiting");
    console.log(newMonitor);
    console.log(req.body);
    return res.status(200).json({
      status: "success",
      data: newMonitor,
    });
  },
);

export const getAllMonitors = factory.getAll(Monitor);
export const getMonitor = factory.getOneMicroservices(Monitor, undefined, [
  {
    path: "project",
    endpoint: "http://project-service:3000/",
  },
]);

export const createMonitorAndForward = <T>(Model: Model<T>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.locals.doc = doc;

    next();
  });

export const activateMonitorIfNeeded = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const doc = res.locals.doc;
    const active = doc.active;

    console.log("DOC");
    console.log(doc);

    if (active) {
      console.log("activating doc");
      await startMonitorService(doc, true);
    }

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  },
);

export const attachMonitorToProjects = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("Adding monitor to project");
    const doc = res.locals.doc;

    const project = req.body.project ?? null;

    if (project) {
      const jwt = req?.cookies.jwt;
      console.log("HEADERS:", jwt);

      console.log(`Adding to project ${project}`);

      const projectHttpClient = new HttpClient({
        baseURL: "http://project-service:3000",
        ...(jwt && {
          jwt,
        }),
      });

      projectHttpClient.post<any>(`/${project}/add-monitor`, {
        monitorId: doc._id,
      });
    }

    next();
  },
);

//export const createPingMonitor = factory.createOne(PingMonitor);
//export const createWebsiteMonitor = factory.createOne(WebsiteMonitor);
export const deleteMonitor = factory.deleteOne(Monitor);
