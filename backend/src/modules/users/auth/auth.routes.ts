import { Router } from "express";
import * as controller from "./auth.controller";

const router = Router();

router.post("/login", controller.loginController);
router.post("/verify-activation", controller.verifyActivationController);
router.post("/complete-registration", controller.completeRegistrationController);
router.post("/send-otp", controller.forgotPasswordController);
router.post("/verify-otp", controller.verifyOtpController);
router.post("/reset-password", controller.resetPasswordController);

export default router;