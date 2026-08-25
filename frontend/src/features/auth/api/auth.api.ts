import { api } from "@/lib/axios";

export const loginApi = async (data: {
  username: string;
  password: string;
}) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const sentCodeApi = async (data: { email: string }) => {
  const res = await api.post("/auth/send-otp", data);
  return res.data;
};

export const verifyOtpApi = async (data: {
  email: string;
  code: string;
}) => {
  const res = await api.post("/auth/verify-otp", data);
  return res.data;
};

export const resetPasswordApi = async (data: {
  email: string;
  newPassword: string;
}) => {
  const res = await api.post("/auth/reset-password", data);
  return res.data;
};

export const getCurrentAdminApi = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export const logoutApi = async () => {
  const res = await api.post("/auth/logout");
  console.log(res);
  return res.data;
};