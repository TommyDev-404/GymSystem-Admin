import { useState } from "react";

import { NotificationsFilters } from "@/features/notifications/components/NotificationsFilter";
import { NotificationsList } from "@/features/notifications/components/NotificationsList";
import { useGetAdminNotifications, useGetNotificationCount, useMarkAllNotifAsRead } from "../hook/useNotifications";
import type { NotificationCount } from "../types/NotifTypes";
import { Check } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
 
export function NotificationsPage() {
  const [filter, setFilter] = useState("All");

  const { data: notificationsData = [], isLoading } = useGetAdminNotifications({ category: filter });
   const { data: notifCount = {} as NotificationCount } = useGetNotificationCount();
   
  const { mutate: markAllAsRead } = useMarkAllNotifAsRead();

  const onMarkAllRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => {
        toast.success("All notifications marked as read");
      },
      onError: () => {
        toast.error("Failed to mark notifications as read");
      },
    });
  };

   const unreadCount = notifCount?.unreadCount ?? 0;

   return (
      <div className="space-y-5">
         {/* Header */}
         <PageHeader
            title="Notifications"
            subtitle={unreadCount === 0 ? "You have no new notifications" : `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`}
            icon={Check}
            actionName="Mark all read"
            setOpen={onMarkAllRead}
         />

        <NotificationsFilters
          filter={filter}
          setFilter={setFilter}
          typeCounts={notifCount?.typeCounts ?? []}
          allCount={notifCount?.allNotifCount ?? 0}
        />

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
         <NotificationsList
           notifications={notificationsData}
           isLoading={isLoading}
         />
      </div>
      </div>
   );
}