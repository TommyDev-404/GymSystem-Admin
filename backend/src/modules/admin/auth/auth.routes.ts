import { Router } from "express";
import {
   loginController,
   forgotPasswordController,
   verifyOTPController,
   resetPasswordController
} from "./auth.controller";

const router = Router();

router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);
router.post("/verify-otp", verifyOTPController);
router.post("/reset-password", resetPasswordController);

export default router;