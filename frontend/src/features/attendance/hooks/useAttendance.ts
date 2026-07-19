import { useQuery } from "@tanstack/react-query";
import * as api from "../api/attendance.api";
import type { Attendance, Filters, QrResponse } from "../types/AttendanceTypes";

export const useTodayQr = () => {
  return useQuery<QrResponse>({
    queryKey: ["session", "today-qr"],
    queryFn: api.getTodayQrApi
  });
};

export const useGetMemberAttendance = (params?: Filters) => {
  return useQuery<Attendance[]>({
    queryKey: ["attendance", params],
    queryFn: () => api.getMemberAttendanceApi(params)
  });
};
