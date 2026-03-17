import { Router } from "express";
import { getBadge, getMonitor } from "../Controllers/badge.controller";
import { protect } from "@monitorapp/shared";

const router = Router();

router.get("/", getBadge);

router.get("/formonitor/:monitorId", protect, getMonitor, getBadge);

export default router;
