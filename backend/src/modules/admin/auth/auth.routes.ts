import { Router } from "express";
import * as controller from "./auth.controller";
import { authMiddleware } from "../../../middlewares/auth";

const router = Router();

router.post("/login", controller.loginController);
router.post("/send-otp", controller.sendOTPController);
router.post("/verify-otp", controller.verifyOTPController);
router.post("/reset-password", controller.resetPasswordController);
router.get("/me", authMiddleware, controller.getCurrentAdmin);
router.post("/logout", authMiddleware, controller.logout);

export default router;