import { api } from "@/lib/axios";
import type { Filters } from "../types/AttendanceTypes";

export const getTodayQrApi = async () => {
  const res = await api.get("/session/qr");
  return res.data;
};

export const getMemberAttendanceApi = async (params?: Filters) => {
  const res = await api.get("/attendance", { params });
  return res.data;
};