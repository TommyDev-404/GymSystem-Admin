import { Request, Response } from "express";
import {
   verifyActivationCode,
   completeRegistration,
   verifyForgotPasswordOtp,
   sendForgotPasswordOtp,
   resetPassword,
   loginUser
} from "./auth.service";

export const loginController = async (req: Request, res: Response) => {

  try {
    const { email, password } = req.body;

    const user = await loginUser(email, password);

    return res.json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyActivationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { activation_code } = req.body;

    const result = await verifyActivationCode(activation_code);

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

export const completeRegistrationController = async (
  req: Request,
  res: Response
) => {
  try {
    const { member_id, password } = req.body;

    const result = await completeRegistration(member_id, password);

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
     const result = await sendForgotPasswordOtp(email);
 
     res.json(result);
   } catch (err: any) {
     res.status(400).json({ message: err.message });
   }
};
 
export const verifyOtpController = async (req: Request, res: Response) => {
   try {
     const { email, code } = req.body;
     const result = await verifyForgotPasswordOtp(email, code);
 
     res.json(result);
   } catch (err: any) {
     res.status(400).json({ message: err.message });
   }
};
 
export const resetPasswordController = async (req: Request, res: Response) => {
  console.log("User reset reach...");
   try {
     const { email, newPassword } = req.body;
     const result = await resetPassword(email, newPassword);
 
     res.json(result);
   } catch (err: any) {
     res.status(400).json({ message: err.message });
   }
 };