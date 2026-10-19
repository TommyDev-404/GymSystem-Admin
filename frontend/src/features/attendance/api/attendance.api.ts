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

export type SessionType = "MORNING" | "AFTERNOON";

type CheckoutPayload = {
  attendance_id: number;
  sessionType: SessionType;
};

export const markCheckoutApi = async ({
  attendance_id,
  sessionType,
}: CheckoutPayload) => {
  const res = await api.post(`/attendance/checkout/${attendance_id}`, {
    sessionType,
  });

  return res.data;
};