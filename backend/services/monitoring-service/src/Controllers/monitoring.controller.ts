import { Request, Response, NextFunction } from "express";
import { MonitorResult } from "../Models/monitor-results.model";
import { catchAsync, factory } from "@monitorapp/shared";
import { MonitorDailyStat } from "../Models/monitor-daily-stats.model";

export const getLastResult = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const { monitorId } = req.params;

    const result = await MonitorResult.findOne({ monitor: monitorId })
      .sort({ start: -1 })
      .lean(); // Faster, returns plain JS object

    res.status(200).json({
      status: "success",
      data: result,
    });
  },
);

export const getAllMonitorResults = factory.getAll(MonitorResult);
export const getAllDailyMonitorResults = factory.getAll(MonitorDailyStat);
