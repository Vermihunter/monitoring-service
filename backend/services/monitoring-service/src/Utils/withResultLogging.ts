import {
  MonitorResult,
  MonitorResultStatus,
} from "../Models/monitor-results.model";
import {
  beginMonitorExecution,
  finalizeMonitorExecution,
} from "../Services/monitorStats.service";
import { IMonitorJobData, MonitorHandlerFn } from "../Types/monitor.types";

export const withResultLogging = (
  handlerLogic: MonitorHandlerFn,
): MonitorHandlerFn => {
  return async (data: IMonitorJobData): Promise<void> => {
    const startTime = Date.now();

    const startedAt = new Date();
    const startedAtMs = startedAt.getTime();

    console.log("Processing data:");
    console.log(data);

    // 1. Create the trace
    /*
    const resultDoc = await MonitorResult.create({
      monitor: data.monitorId,
      start: startTime,
      status: MonitorResultStatus.IN_PROGRESS,
      responseInMs: 0,
    });
    */

    const resultDoc = await beginMonitorExecution({
      monitorId: data.monitorId,
      start: startedAt,
    });

    console.log("Result doc:");
    console.log(resultDoc);

    try {
      // 2. Execute the actual monitor logic (Ping or Website)
      await handlerLogic(data);

      // 3. If it didn't throw, update as SUCCESS
      /*
      await resultDoc.updateOne({
        status: MonitorResultStatus.SUCCESS,
        responseInMs: Date.now() - startTime,
      });
      */

      await finalizeMonitorExecution({
        resultId: resultDoc._id.toString(),
        status: MonitorResultStatus.SUCCESS,
        responseInMs: Date.now() - startedAtMs,
        errorMessage: null,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown monitor failure";

      try {
        await finalizeMonitorExecution({
          resultId: resultDoc._id.toString(),
          status: MonitorResultStatus.FAILED,
          responseInMs: Date.now() - startedAtMs,
          errorMessage: message,
        });
      } catch (persistErr) {
        const persistMessage =
          persistErr instanceof Error ? persistErr.message : String(persistErr);

        throw new Error(
          `Monitor failed: ${message}; additionally failed to persist result/stats: ${persistMessage}`,
        );
      }

      throw error;
    }
  };
};
