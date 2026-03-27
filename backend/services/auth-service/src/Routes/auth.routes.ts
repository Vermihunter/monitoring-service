import express from "express";
import { protect } from "@monitorapp/shared";
import * as authController from "../Controllers/auth.controller";

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

router.use(protect);

router.get("/me", authController.getMe, authController.getUser);

export default router;
