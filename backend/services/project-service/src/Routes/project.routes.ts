import { Router } from "express";
import * as projectController from "../Controllers/project.controller";
import { protect, restrictTo } from "@monitorapp/shared";

const router = Router();

router.use(protect);

router
  .route("/")
  .get(projectController.getAllProjects) // restrictTo("admin"),
  .post(
    restrictTo("user"),
    projectController.userToUserId,
    projectController.createProject,
  );

router
  .route("/:id")
  .get(
    projectController.findProject({
      filter: (req: any) => ({
        user: req.user.id,
        _id: req.params.id,
      }),
    }),
  )
  .post(projectController.updateProject)
  .delete(projectController.deleteProject);

router.post("/:id/add-monitor", projectController.addMonitor);

export default router;
