import { Router } from "express";
import * as projectController from "../Controllers/project.controller";
import { protect, restrictTo } from "@monitorapp/shared";

const router = Router();

router
  .route("/")
  .get(restrictTo("admin"), projectController.getAllProjects)
  .post(protect, restrictTo("user"), projectController.createProject);

router.route("/:id").get(
  protect,
  projectController.findProject({
    filter: (req: any) => ({
      user: req.user._id,
      _id: req.params.id,
    }),
  }),
);

export default router;
