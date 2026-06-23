import { api } from "@/lib/axios";

/* ---------------- LOGIN ---------------- */
type LoginPayload = {
  username: string;
  password: string;
};

type LoginResponse = {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
  };
};

export const loginApi = async (data: LoginPayload) => {
  const res = await api.post<LoginResponse>("/auth/login", data);
  return res.data;
};

/* ---------------- FORGOT PASSWORD ---------------- */
type ForgotPasswordPayload = {
  email: string;
};

export const forgotPasswordApi = async (data: ForgotPasswordPayload) => {
  const res = await api.post("/auth/forgot-password", data);
  return res.data;
};

/* ---------------- VERIFY OTP ---------------- */
type VerifyOTPPayload = {
  email: string;
  code: string;
};

export const verifyOtpApi = async (data: VerifyOTPPayload) => {
  const res = await api.post("/auth/verify-otp", data);
  return res.data;
};

/* ---------------- RESET PASSWORD ---------------- */
type ResetPasswordPayload = {
  email: string;
  newPassword: string;
};

export const resetPasswordApi = async (data: ResetPasswordPayload) => {
  const res = await api.post("/auth/reset-password", data);
  return res.data;
};