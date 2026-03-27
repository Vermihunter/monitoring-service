import { Router } from "express";
import {
  getLastResult,
  getAllMonitorResults,
  getAllDailyMonitorResults,
} from "../Controllers/monitoring.controller";

const router = Router();

router.get("/", getAllMonitorResults);
router.get("/daily-stats", getAllDailyMonitorResults);
router.get("/:monitorId/latest-result", getLastResult);

export default router;
