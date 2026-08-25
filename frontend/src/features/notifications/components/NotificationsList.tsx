import { Button } from "@/components/ui/button";
import {
  defaultTypeConfig,
  typeConfig,
} from "@/features/notifications/constants/typeConfig";
import { EmptyState } from "./EmptyState";
import type { Notifications } from "../types/NotifTypes";
import { Check, X } from "lucide-react";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import {
  useDeleteNotification,
  useMarkNotifAsRead,
} from "../hook/useNotifications";
import { toast } from "sonner";
import { Loader } from "@/components/shared/Loader";

interface Props {
  notifications: Notifications[];
  isLoading: boolean;
}

export function NotificationsList({
  notifications,
  isLoading,
}: Props) {
  const { mutate: markNotifRead } = useMarkNotifAsRead();
  const { mutate: deleteNotif } = useDeleteNotification();

  const markRead = (id: number) => {
    markNotifRead(id, {
      onSuccess: () => {
        toast.success("Marked as read successfully.");
      },
    });
  };

  const onRemoveNotif = (id: number) => {
    deleteNotif(id, {
      onSuccess: () => {
        toast.success("Notification removed successfully.");
      },
    });
  };

  return (
    <div className="space-y-2">
      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader />
        </div>
      ) : notifications.length === 0 ? (
        <div className="flex h-full min-h-[400px] items-center justify-center">
          <EmptyState
            title="No notifications"
            message="No notifications found in this category."
          />
        </div>
      ) : (
        notifications.map((notification) => {
          const config =
            typeConfig[
              notification.category as keyof typeof typeConfig
            ] ?? defaultTypeConfig;

          const Icon = config.icon;

          return (
            <div
              key={notification.id}
              className={`rounded-2xl border p-4 shadow-sm transition-all ${
                notification.is_read
                  ? "border-slate-100 bg-white opacity-70 dark:border-stone-800 dark:bg-stone-900"
                  : "border-[#8B1E2D]/20 bg-[#8B1E2D]/[0.04] dark:border-[#A92B3D]/30 dark:bg-[#8B1E2D]/10"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${config.color}`}
                >
                  <Icon size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          notification.is_read
                            ? "text-slate-600 dark:text-slate-400"
                            : "text-slate-800 dark:text-slate-100"
                        }`}
                      >
                        {notification.title}
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {notification.description}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1">
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markRead(notification.id)}
                          className="h-8 w-8 rounded-lg text-slate-500 hover:bg-[#8B1E2D]/10 hover:text-[#8B1E2D] dark:hover:bg-[#8B1E2D]/20 dark:hover:text-[#A92B3D]"
                        >
                          <Check size={14} />
                        </Button>
                      )}

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveNotif(notification.id)}
                        className="h-8 w-8 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40"
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>

                  <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                    {formatTimeAgo(notification.created_at)}
                  </p>
                </div>

                {!notification.is_read && (
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#8B1E2D]" />
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}