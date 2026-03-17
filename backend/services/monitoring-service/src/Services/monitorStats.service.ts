import { Types } from "mongoose";
import {
  MonitorResult,
  MonitorDocument,
  MonitorResultStatus,
} from "../Models/monitor-results.model";
import { MonitorDailyStat } from "../Models/monitor-daily-stats.model";
import { nextUtcDayStart, toUtcDayStart } from "../Utils/dates";

export async function beginMonitorExecution(params: {
  monitorId: string;
  start?: Date;
}): Promise<MonitorDocument> {
  return MonitorResult.create({
    monitor: params.monitorId,
    start: params.start ?? new Date(),
    status: MonitorResultStatus.IN_PROGRESS,
    responseInMs: null,
    errorMessage: null,
  });
}

async function incrementStatsForFinalResult_(params: {
  monitor: Types.ObjectId;
  start: Date;
  status: MonitorResultStatus.SUCCESS | MonitorResultStatus.FAILED;
  responseInMs: number;
}) {
  const day = toUtcDayStart(params.start);

  await MonitorDailyStat.updateOne(
    { day, monitor: params.monitor },
    {
      $setOnInsert: {
        day,
        monitor: params.monitor,
        successCount: 0,
        failureCount: 0,
        responseTimeCount: 0,
        responseTimeSum: 0,
        responseTimeAvg: null,
        responseTimeMin: null,
        responseTimeMax: null,
        generatedAt: new Date(),
      },
      $inc: {
        successCount: params.status === MonitorResultStatus.SUCCESS ? 1 : 0,
        failureCount: params.status === MonitorResultStatus.FAILED ? 1 : 0,
        responseTimeCount: 1,
        responseTimeSum: params.responseInMs,
      },
      $min: {
        responseTimeMin: params.responseInMs,
      },
      $max: {
        responseTimeMax: params.responseInMs,
      },
    },
    { upsert: true },
  );

  await MonitorDailyStat.updateOne({ day, monitor: params.monitor }, [
    {
      $set: {
        responseTimeAvg: {
          $cond: [
            { $gt: ["$responseTimeCount", 0] },
            { $divide: ["$responseTimeSum", "$responseTimeCount"] },
            null,
          ],
        },
        generatedAt: "$$NOW",
      },
    },
  ]);
}

async function incrementStatsForFinalResult(params: {
  monitor: Types.ObjectId;
  start: Date;
  status: MonitorResultStatus.SUCCESS | MonitorResultStatus.FAILED;
  responseInMs: number;
}) {
  const day = toUtcDayStart(params.start);

  await MonitorDailyStat.updateOne(
    { day, monitor: params.monitor },
    {
      $setOnInsert: {
        day,
        monitor: params.monitor,
        generatedAt: new Date(),
      },
      $inc: {
        successCount: params.status === MonitorResultStatus.SUCCESS ? 1 : 0,
        failureCount: params.status === MonitorResultStatus.FAILED ? 1 : 0,
        responseTimeCount: 1,
        responseTimeSum: params.responseInMs,
      },
      $min: {
        responseTimeMin: params.responseInMs,
      },
      $max: {
        responseTimeMax: params.responseInMs,
      },
    },
    { upsert: true },
  );

  await MonitorDailyStat.updateOne(
    { day, monitor: params.monitor },
    [
      {
        $set: {
          responseTimeAvg: {
            $cond: [
              { $gt: ["$responseTimeCount", 0] },
              { $divide: ["$responseTimeSum", "$responseTimeCount"] },
              null,
            ],
          },
          generatedAt: "$$NOW",
        },
      },
    ],
    { updatePipeline: true },
  );
}

export async function finalizeMonitorExecution(params: {
  resultId: string;
  status: MonitorResultStatus.SUCCESS | MonitorResultStatus.FAILED;
  responseInMs: number;
  errorMessage?: string | null;
}) {
  const doc = await MonitorResult.findOneAndUpdate(
    {
      _id: params.resultId,
      status: MonitorResultStatus.IN_PROGRESS,
    },
    {
      $set: {
        status: params.status,
        responseInMs: params.responseInMs,
        errorMessage: params.errorMessage ?? null,
      },
    },
    {
      returnDocument: "after",
    },
  );

  if (!doc) {
    return {
      finalized: false,
      reason: "already-finalized-or-missing" as const,
    };
  }

  const finalStatus = doc.status;

  if (
    finalStatus !== MonitorResultStatus.SUCCESS &&
    finalStatus !== MonitorResultStatus.FAILED
  ) {
    throw new Error(`Unexpected non-final status: ${finalStatus}`);
  }

  try {
    await incrementStatsForFinalResult({
      monitor: doc.monitor,
      start: doc.start,
      status: finalStatus,
      responseInMs: doc.responseInMs ?? 0,
    });
  } catch (err) {
    console.error("Failed to update MonitorDailyStat", err);
  }

  return {
    finalized: true,
    doc,
  };
}
