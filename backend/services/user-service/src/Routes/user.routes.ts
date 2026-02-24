import { Router, RequestHandler } from "express";
import * as userController from "../Controllers/user.controller";
import { protect, restrictTo } from "@monitorapp/shared";

const router = Router();

router.route("/").post(userController.createUser);
router.route("/:id/user-exists").get(userController.userExists);

// Protect all routes after this middleware
router.use(protect);

router.get(
  "/me",
  userController.getMe as RequestHandler,
  userController.getUser,
);

router.patch(
  "/updateMe",
  userController.uploadUserPhoto,
  userController.resizeUserPhoto,
  userController.updateMe,
);

router.delete("/deleteMe", userController.deleteMe);
router.delete("/deleteMe", userController.deleteMe);

router.use(restrictTo("admin"));

router.route("/").get(userController.getAllUsers);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

export default router;
