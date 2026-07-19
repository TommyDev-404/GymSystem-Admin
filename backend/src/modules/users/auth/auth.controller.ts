import { Request, Response } from "express";
import * as service from "./auth.service";

export const loginController = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const result = await service.loginUser(email, password);

		return res.json(result);
	} catch (error: any) {
		return res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const verifyActivationController = async (req: Request, res: Response) => {
	try {
		const { activation_code } = req.body;

		const result = await service.verifyActivationCode(activation_code);

		return res.json({
			success: true,
			data: result,
		});
	} catch (error: any) {
		return res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const completeRegistrationController = async (req: Request, res: Response) => {
	try {
		const { member_id, password } = req.body;

		const result = await service.completeRegistration(member_id, password);

		return res.json(result);
	} catch (error: any) {
		return res.status(400).json({
			success: false,
			message: error.message,
		});
	}
};

export const forgotPasswordController = async (req: Request, res: Response) => {
   try {
     const { email } = req.body;
     const result = await service.sendForgotPasswordOtp(email);
 
     res.json(result);
   } catch (err: any) {
     res.status(400).json({ message: err.message });
   }
};
 
export const verifyOtpController = async (req: Request, res: Response) => {
	try {
		const { email, code } = req.body;
		const result = await service.verifyForgotPasswordOtp(email, code);

		res.json(result);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
};
 
export const resetPasswordController = async (req: Request, res: Response) => {
	try {
		const { email, newPassword } = req.body;
		const result = await service.resetPassword(email, newPassword);

		res.json(result);
	} catch (err: any) {
		res.status(400).json({ message: err.message });
	}
 };