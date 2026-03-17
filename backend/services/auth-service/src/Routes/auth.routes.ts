import express from "express";
import { protect } from "@monitorapp/shared";
import * as authController from "../Controllers/auth.controller";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.use(protect);

router.get("/me", authController.getMe, authController.getUser);

// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
// router.use(authController.protect);

// router.patch("/updateMyPassword", authController.updatePassword);

export default router;
