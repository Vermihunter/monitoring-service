import { Router } from "express";
import * as monitorController from "../Controllers/monitor.controller";
import { protect, factory } from "@monitorapp/shared";
import { PingMonitor } from "../Models/ping-monitor.model";
import { WebsiteMonitor } from "../Models/website-monitor.model";
// const userController = require("./../controllers/userController");
// const authController = require("./../controllers/authController");

const router = Router();

router.use(protect);

router.route("/").get(monitorController.getAllMonitors);

router
  .route("/pingmonitor")
  .post(
    monitorController.createMonitorAndForward(PingMonitor),
    monitorController.attachMonitorToProjects,
    monitorController.activateMonitorIfNeeded,
  );

router
  .route("/websitemonitor")
  .post(
    monitorController.createMonitorAndForward(WebsiteMonitor),
    monitorController.attachMonitorToProjects,
    monitorController.activateMonitorIfNeeded,
  );

router
  .route("/:id")
  .get(monitorController.getMonitor)
  .post(monitorController.updateMonitor)
  .delete(monitorController.deleteMonitor);

router.route("/:id/activate").post(monitorController.startMonitor);
router.route("/:id/deactivate").post(monitorController.cancelMonitor);

export default router;
