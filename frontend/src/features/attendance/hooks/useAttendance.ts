import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

type SessionType = "MORNING" | "AFTERNOON";

type CheckoutPayload = {
  attendance_id: number;
  sessionType: SessionType;
};

export function useCheckoutMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ attendance_id, sessionType }: CheckoutPayload) =>
      api.markCheckoutApi({ attendance_id, sessionType }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary-data"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-recent-activity"],
      });
    },
  });
}