import { useState } from "react";

import { NotificationsHeader } from "@/features/notifications/components/NotificationsHeader";
import { NotificationsFilters } from "@/features/notifications/components/NotificationsFilter";
import { NotificationsList } from "@/features/notifications/components/NotificationsList";

const initialNotifications = [
   {
     id: 1,
     type: "payment",
     title: "Payment Overdue",
     message:
       "Carlos Rivera's Basic plan payment is 25 days overdue ($45)",
     time: "Just now",
     read: false,
   },
   {
     id: 2,
     type: "expiry",
     title: "Membership Expiring",
     message: "James Wilson's membership expires in 3 days",
     time: "5 min ago",
     read: false,
   },
   {
     id: 3,
     type: "reward",
     title: "Reward Claimed",
     message:
       "Priya Patel redeemed 'Free Personal Training Session' (500 pts)",
     time: "22 min ago",
     read: false,
   },
   {
     id: 4,
     type: "checkin",
     title: "New Member Check-In",
     message:
       "Zoe Kim checked in for the first time today at 08:22 AM",
     time: "38 min ago",
     read: false,
   },
   {
     id: 5,
     type: "alert",
     title: "Capacity Warning",
     message:
       "Gym reached 85% capacity. Consider managing access.",
     time: "1 hr ago",
     read: true,
   },
   {
     id: 6,
     type: "payment",
     title: "Payment Received",
     message:
       "Luca Ferrari paid $139 for Elite plan (July)",
     time: "2 hrs ago",
     read: true,
   },
   {
     id: 7,
     type: "expiry",
     title: "Membership Expiring",
     message:
       "Raj Sharma's Premium membership expires in 7 days",
     time: "3 hrs ago",
     read: true,
   },
   {
     id: 8,
     type: "reward",
     title: "Points Milestone",
     message:
       "Emma Davis reached 500 points — eligible for rewards!",
     time: "5 hrs ago",
     read: true,
   },
   {
     id: 9,
     type: "checkin",
     title: "High Attendance Day",
     message:
       "Today had 203 check-ins — highest this month!",
     time: "Yesterday",
     read: true,
   },
   {
     id: 10,
     type: "payment",
     title: "Payment Overdue",
     message:
       "Raj Sharma's Premium plan payment is 20 days overdue ($89)",
     time: "Yesterday",
     read: true,
   },
];
 
export function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All"
      ? notifications
      : notifications.filter((n) => n.type === filter);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true }))
    );

   const markRead = (id: number) =>
      setNotifications((prev) =>
         prev.map((n) =>
         n.id === id ? { ...n, read: true } : n
         )
      );

   const dismiss = (id: number) =>
      setNotifications((prev) =>
         prev.filter((n) => n.id !== id)
      );

   return (
      <div className="space-y-5">

         <NotificationsHeader
            unreadCount={unreadCount}
            onMarkAllRead={markAllRead}
         />

         <NotificationsFilters
            filter={filter}
            setFilter={setFilter}
            notifications={notifications}
         />

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
         <NotificationsList
            notifications={filtered}
            onRead={markRead}
            onDismiss={dismiss}
         />
      </div>
      </div>
   );
}