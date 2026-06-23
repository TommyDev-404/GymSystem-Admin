import { Router } from "express";
import {
   verifyActivationController,
   completeRegistrationController,
   loginController,
   verifyOtpController,
   forgotPasswordController,
   resetPasswordController
} from "./auth.controller";

const router = Router();

router.post("/login", loginController);
router.post("/verify-activation", verifyActivationController);
router.post("/complete-registration", completeRegistrationController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-otp", verifyOtpController);
router.post("/reset-password", resetPasswordController);

export default router;