import { Router } from "express";
import * as monitorController from "../Controllers/monitor.controller";
import { protect } from "@monitorapp/shared";
// const userController = require("./../controllers/userController");
// const authController = require("./../controllers/authController");

const router = Router();

router.use(protect);

router.route("/").get(monitorController.getAllMonitors);
router
  .route("/:id")
  .get(monitorController.getMonitor)
  .post(monitorController.updateMonitor);

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
