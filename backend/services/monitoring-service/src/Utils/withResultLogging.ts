import {
  MonitorResult,
  MonitorResultStatus,
} from "../Models/monitor-results.model";
import { IMonitorJobData, MonitorHandlerFn } from "../Types/monitor.types";

export const withResultLogging = (
  handlerLogic: MonitorHandlerFn,
): MonitorHandlerFn => {
  return async (data: IMonitorJobData): Promise<void> => {
    const startTime = Date.now();

    console.log("Processing data:");
    console.log(data);

    // 1. Create the trace
    const resultDoc = await MonitorResult.create({
      monitor: data.monitorId,
      start: startTime,
      status: MonitorResultStatus.IN_PROGRESS,
      responseInMs: 0,
    });

    console.log("Result doc:");
    console.log(resultDoc);

    try {
      // 2. Execute the actual monitor logic (Ping or Website)
      await handlerLogic(data);

      // 3. If it didn't throw, update as SUCCESS
      await resultDoc.updateOne({
        status: MonitorResultStatus.SUCCESS,
        responseInMs: Date.now() - startTime,
      });
    } catch (error: any) {
      // 4. If it threw, update as FAILED
      await resultDoc.updateOne({
        status: MonitorResultStatus.FAILED,
        responseInMs: Date.now() - startTime,
        errorMessage: error.message,
      });

      // 5. Important: Re-throw so BullMQ knows the job failed
      throw error;
    }
  };
};
