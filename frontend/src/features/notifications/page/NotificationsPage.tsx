import { useState } from "react";

import { NotificationsHeader } from "@/features/notifications/components/NotificationsHeader";
import { NotificationsFilters } from "@/features/notifications/components/NotificationsFilter";
import { NotificationsList } from "@/features/notifications/components/NotificationsList";
import { useGetAdminNotifications, useGetNotificationCount } from "../hook/useNotifications";
import type { NotificationCount } from "../types/NotifTypes";
 
export function NotificationsPage() {
  const [filter, setFilter] = useState("All");

  const { data: notificationsData = [], isLoading } = useGetAdminNotifications({ type: filter });
  const { data: notifCount = {} as NotificationCount} = useGetNotificationCount();

   console.log(notifCount);
  const unreadCount = notifCount?.unreadCount ?? 0;

   return (
      <div className="space-y-5">

         <NotificationsHeader
            unreadCount={unreadCount}
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