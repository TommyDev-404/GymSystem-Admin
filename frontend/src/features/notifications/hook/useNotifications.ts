import { useQuery } from "@tanstack/react-query";
import * as api from "@/features/notifications/api/notif.api";

export function useGetAdminNotifications(params?: { type: string }) {
   return useQuery({
     queryKey: ["admin-notifications", params],
     queryFn: () => api.getAdminNotificationsApi(params)
   });
 }
