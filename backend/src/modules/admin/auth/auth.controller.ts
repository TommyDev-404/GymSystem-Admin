import { Request, Response } from "express";
import * as authService from "./auth.service";

/* ---------------- LOGIN ---------------- */
export const loginController = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const data = await authService.login(username, password);

    return res.status(200).json(data);
  } catch (err: any) {
    return res.status(401).json({
      message: err.message || "Login failed",
    });
  }
};

/* ---------------- FORGOT PASSWORD ---------------- */
export const forgotPasswordController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email } = req.body;

    await authService.sendResetOTP(email);

    return res.status(200).json({
      message: "OTP sent",
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Failed to send OTP",
    });
  }
};

/* ---------------- VERIFY OTP ---------------- */
export const verifyOTPController = async (
  req: Request,
  res: Response
) => {
  try {
    const { email, code } = req.body;

    await authService.verifyOTP(email, code);

    return res.status(200).json({
      message: "OTP valid",
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Invalid OTP",
    });
  }
};

/* ---------------- RESET PASSWORD ---------------- */
export const resetPasswordController = async (
  req: Request,
  res: Response
) => {
  console.log('Reach resetting pass...')
  try {
    const { email, newPassword } = req.body;
    console.log("DAta: ", email, newPassword);
    await authService.resetPassword(email, newPassword);

    return res.status(200).json({
      message: "Password updated",
    });
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Failed to reset password",
    });
  }
};