import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "@/features/notifications/api/notif.api";
import type { NotificationCount, Notifications } from "../types/NotifTypes";

export function useGetAdminNotifications(params?: { type: string }) {
  return useQuery<Notifications[]>({
    queryKey: ["admin-notifications", params],
    queryFn: () => api.getAdminNotificationsApi(params)
  });
}

export function useGetNotificationCount() {
  return useQuery<NotificationCount>({
    queryKey: ["notification-count"],
    queryFn: () => api.getNotificationCountApi(),
  });
}

export function useMarkNotifAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.markNotifAsReadApi(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notification-count"],
      });
    },
  });
}

export function useMarkAllNotifAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.markAllNotifAsReadApi(),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-notifications"],
      });
      
      queryClient.invalidateQueries({
        queryKey: ["notification-count"],
      });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.deleteNotificationApi(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-notifications"],
      });

      queryClient.invalidateQueries({
        queryKey: ["notification-count"],
      });
    },
  });
}