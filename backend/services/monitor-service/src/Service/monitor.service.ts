import { MonitorDocument, Monitor } from "../Models/monitor.model";
import { eventQueue } from "../Queue/queue";
import { AppError } from "@monitorapp/shared";

function queueIdForMonitor(monitor: MonitorDocument) {
  return `monitor-${monitor.id}`;
}

export async function startMonitorService(monitor: any) {
  const monitorObj = monitor.toObject();

  const {
    periodicity,
    active,
    project,
    _id,
    __v,
    createdAt,
    updatedAt,
    ...queueData
  } = monitorObj as any;

  if (active) {
    return { message: "Monitor was already active" };
  }

  await Monitor.findByIdAndUpdate(_id, {
    active: true,
  });

  const job = await eventQueue.upsertJobScheduler(
    queueIdForMonitor(monitor),
    {
      every: periodicity * 1000,
    },
    {
      name: "monitoring",
      data: { ...queueData, monitorId: monitor.id },
      opts: {},
    },
  );

  console.log("Monitor activated");

  return { job };
}

export async function cancelMonitorService(monitor: any) {
  if (!monitor.active) {
    return { message: "Monitor was not running" };
  }

  const result = await eventQueue.removeJobScheduler(
    queueIdForMonitor(monitor),
  );

  if (!result) {
    throw new AppError("Cannot cancel monitor - Missing Job Scheduler", 400);
  }

  await Monitor.findByIdAndUpdate(monitor._id, {
    active: false,
  });

  console.log("Monitor canceled");

  return { status: "success" };
}
