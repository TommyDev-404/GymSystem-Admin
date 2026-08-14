import { useState } from "react";

import { NotificationsFilters } from "@/features/notifications/components/NotificationsFilter";
import { NotificationsList } from "@/features/notifications/components/NotificationsList";
import { useGetAdminNotifications, useGetNotificationCount, useMarkAllNotifAsRead } from "../hook/useNotifications";
import type { NotificationCount } from "../types/NotifTypes";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";
 
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
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-slate-800 dark:text-slate-100 font-bold text-xl">
                  Notifications
               </h1>

               <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">
                  {unreadCount === 0 ? "You have no new notifications" : `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`}
               </p>
               
            </div>

            {unreadCount > 0  && (
               <Button
                  className="bg-emerald-500 dark:bg-emerald-600 py-5 px-3 hover:bg-emerald-600 dark:hover:bg-emerald-700 text-white"
                  onClick={onMarkAllRead}
               >
                  <Check size={14} />
                  Mark all read
               </Button>
            )}
         </div>

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