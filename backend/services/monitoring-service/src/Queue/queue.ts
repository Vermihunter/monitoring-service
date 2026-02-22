import { Queue } from "bullmq";
import { connection } from "../Config/redis";

export const eventQueue = new Queue("active_monitors", {
  connection,
});
