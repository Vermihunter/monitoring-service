import { Router } from "express";
import { getBadge, getMonitor } from "../Controllers/badge.controller";

const router = Router();

router.get("/", getBadge);
router.get("/formonitor/:monitorId", getMonitor, getBadge);

export default router;
