import { Request, Response } from "express";
import * as authService from "./auth.service";


export const getCurrentAdmin = async (
  req: Request,
  res: Response
) => {
  if (!req.user) {
    throw new Error("Unauthorized");
  }

  const admin = await authService.getCurrentAdminService(req.user.id);

  res.status(200).json({
    user: admin,
  });
};

export const loginController = async (req: Request, res: Response) => {
	try {
		const { username, password } = req.body;
	
		const result = await authService.login(username, password);
	
		res.cookie("admin_token", result.token, {
			httpOnly: true,
			secure: false,
			sameSite: "lax",
			maxAge: 1000 * 60 * 60 * 24,
		});
	
		res.status(200).json({
			message: "Login successful",
			user: result.user,
		});
	} catch (error) {
		res.status(401).json({
			message: error instanceof Error ? error.message : "Login failed",
		});
	}
};

export const logout = async (req: Request, res: Response) => {
	res.clearCookie("admin_token", {
	  httpOnly: true,
	  secure: false,
	  sameSite: "lax",
	});
 
	res.status(200).json({
	  message: "Logged out successfully",
	});
};

export const sendOTPController = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;

		await authService.sendResetOTP(email);

		return res.status(200).json({
			message: "OTP sent successfully",
		});
	} catch (err: any) {
		return res.status(400).json({
			message: err.message || "Failed to send OTP",
		});
	}
};

export const verifyOTPController = async (req: Request, res: Response) => {
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

export const resetPasswordController = async (req: Request, res: Response) => {
	try {
		const { email, newPassword } = req.body;
		
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