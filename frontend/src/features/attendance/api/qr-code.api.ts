import { api } from "@/lib/axios";

export const getTodayQrApi = async () => {
  const res = await api.get("/session/qr");
  return res.data;
};