import express from "express";
import * as authController from "../Controllers/auth.controller";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

// router.post("/forgotPassword", authController.forgotPassword);
// router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
// router.use(authController.protect);

// router.patch("/updateMyPassword", authController.updatePassword);

export default router;
