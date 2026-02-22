import { Router } from "express";
import * as projectController from "../Controllers/project.controller";

const router = Router();

router.route("/").get(projectController.getAllProjects).post(
  //authController.restrictTo("user"),
  //reviewController.setTourUserIds,
  projectController.createProject,
);

router.route("/:id").get(projectController.getProject);

export default router;
