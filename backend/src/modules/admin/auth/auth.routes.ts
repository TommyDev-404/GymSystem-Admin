import { Router } from "express";
import * as controller from "./auth.controller";

const router = Router();

router.post("/login", controller.loginController);
router.post("/send-otp", controller.sendOTPController);
router.post("/verify-otp", controller.verifyOTPController);
router.post("/reset-password", controller.resetPasswordController);

export default router;