import {
  findAdminByUsername,
  findUserByEmail,
  updatePassword,
  createOtp,
  findValidOtp,
  markOtpUsed,
 } from "./auth.repository";
 
 import { comparePassword, hashPassword } from "../../../utils/password";
 import { signToken } from "../../../utils/jwt";
 import { generateOTP } from "../../../utils/otp-generator";
 import { transporter } from "../../../utils/mailer";
 
 // ==================== LOGIN ====================
 export const login = async (username: string, password: string) => {
   const user = await findAdminByUsername(username);
 
   if (!user) throw new Error("User not found");
 
   if (user.role !== "ADMIN") {
     throw new Error("Not authorized");
   }
 
   const isValid = await comparePassword(password, user.hash_pass);
 
   if (!isValid) {
     throw new Error("Invalid password");
   }
   const token = signToken({
     id: user.id,
     role: user.role,
   });
 
   return {
     token,
     user,
   };
 };
 
 // ==================== FORGOT PASSWORD (SEND OTP) ====================
export const sendResetOTP = async (email: string) => {
   const user = await findUserByEmail(email);
 
   if (!user) throw new Error("User not found");
 
   const code = generateOTP();
 
   await createOtp({
     user_id: user.id,
     code,
     purpose: "RESET_PASSWORD",
     expiresAt: new Date(Date.now() + 5 * 60 * 1000),
   });
 
   await transporter.sendMail({
     to: email,
     subject: "Password Reset OTP",
     text: `Your OTP is ${code}. It expires in 5 minutes.`,
   });
 
   return true;
 };
 
 // ==================== VERIFY OTP ====================
 
 export const verifyOTP = async (
   email: string,
   code: string
 ) => {
   const user = await findUserByEmail(email);
 
   if (!user) throw new Error("User not found");
 
   const otp = await findValidOtp(
     user.id,
     code,
     "RESET_PASSWORD"
   );
 
   if (!otp) throw new Error("Invalid or expired OTP");
 
   await markOtpUsed(otp.id);
 
   return true;
 };
 
 // ==================== RESET PASSWORD ====================
 
 export const resetPassword = async (
   email: string,
   newPassword: string
 ) => {
   const user = await findUserByEmail(email);
 
   if (!user) throw new Error("User not found");
 
   console.log(newPassword);
   const hashed = await hashPassword(newPassword);
   
   await updatePassword(user.id, newPassword, hashed);
 
   return true;
 };