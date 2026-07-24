import { Button } from "@/components/ui/button";
import { typeConfig } from "@/features/notifications/constants/typeConfig";
import { EmptyState } from "./EmptyState";
import type { Notifications } from "../types/NotifTypes";
import { Check, X } from "lucide-react";
import { formatTimeAgo } from "@/utils/formatTimeAgo";
import { useDeleteNotification, useMarkNotifAsRead } from "../hook/useNotifications";
import { toast } from "sonner";
import { Loader } from "@/components/shared/Loader";

interface Props {
  notifications: Notifications[];
  isLoading: boolean;
}

export function NotificationsList({
  notifications,
  isLoading
}: Props) {

  const { mutate: markNotifRead } = useMarkNotifAsRead();
  const { mutate: deleteNotif } = useDeleteNotification();
  

  const markRead = (id: number) => {
    markNotifRead(id, {
      onSuccess: () => {
        toast.success("Mark as read successfully.")
      }
    });
  };

  const onRemoveNotif = (id: number) => {
    deleteNotif(id, {
      onSuccess: () => {
        toast.success("Notification remove successfully.")
      }
    });
  };

  return (
    <div className="space-y-2">
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[300px]">
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
        notifications.map((n) => {
          const cfg = typeConfig[n.type];
          const Icon = cfg.icon;
  
          return (
            <div
              key={n.id}
              className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
                n.is_read
                  ? "border-slate-100 opacity-70"
                  : "border-emerald-200 bg-emerald-50/30"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* ICON */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.color}`}
                >
                  <Icon size={16} />
                </div>
  
                {/* CONTENT */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          n.is_read
                            ? "text-slate-600"
                            : "text-slate-800"
                        }`}
                      >
                        {n.title}
                      </p>
  
                      <p className="text-slate-500 text-xs mt-0.5">
                        {n.message}
                      </p>
                    </div>
  
                    {/* ACTIONS */}
                    <div className="flex items-center gap-1 shrink-0">
                      {!n.is_read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => markRead(n.id)}
                        >
                          <Check size={14} />
                        </Button>
                      )}
  
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveNotif(n.id)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
  
                  <p className="text-slate-400 text-xs mt-1.5">
                    {formatTimeAgo(n.created_at)} ago
                  </p>
                </div>
  
                {/* UNREAD DOT */}
                {!n.is_read && (
                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 shrink-0" />
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}