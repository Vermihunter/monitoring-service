import { Router } from "express";
import * as monitorController from "../Controllers/monitor.controller";
// const userController = require("./../controllers/userController");
// const authController = require("./../controllers/authController");

const router = Router();

router.route("/").get(monitorController.getAllMonitors);
router.route("/:id").get(monitorController.getMonitor);
router.route("/:id/activate").post(monitorController.startMonitor);
router.route("/:id/deactivate").post(monitorController.cancelMonitor);

router.route("/pingmonitor").post(
  //authController.restrictTo("user"),
  //reviewController.setTourUserIds,
  monitorController.createPingMonitor,
);

router.route("/websitemonitor").post(
  //authController.restrictTo("user"),
  //reviewController.setTourUserIds,
  monitorController.createWebsiteMonitor,
);

export default router;
