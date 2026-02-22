import { Router } from "express";
import { getLastResult } from "../Controllers/monitoring.controller";

const router = Router();

router.get("/:monitorId/latest-result", getLastResult);

export default router;
