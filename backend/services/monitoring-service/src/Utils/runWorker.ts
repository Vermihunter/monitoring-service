import { Worker } from "bullmq";
import { connection } from "../Config/redis";
import { MonitorRegistry } from "../Handlers";

export default function runWorker() {
  const worker = new Worker(
    "active_monitors",
    async (job: any) => {
      const { type } = job.data;
      const handlerFn = MonitorRegistry[type];

      if (!handlerFn) {
        throw new Error(`No handler found for monitor type: ${type}`);
      }

      console.log(`🚀 Processing ${type} [${job.id}]`);

      // Execute the specific logic
      await handlerFn(job.data);

      console.log("Job completed:", job.id);
    },
    {
      connection,
      concurrency: 5,
      removeOnComplete: { count: 0 }, // 🔥 removes completed jobs
      removeOnFail: { count: 0 }, // 🔥 removes failed jobs
    },
  );

  worker.on("completed", (job: any) => {
    console.log(`✅ Job ${job.id} completed`);
  });

  worker.on("failed", (job: any, err: Error) => {
    console.error(`❌ Job ${job.id} failed`, err);
  });
}
