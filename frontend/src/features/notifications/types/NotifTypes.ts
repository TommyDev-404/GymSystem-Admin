import type { typeConfig } from "../constants/typeConfig";

export type Notifications = {
   id: number;
   recipient_id: number;
   type: keyof typeof typeConfig;
   title: string;
   description: string;
   is_read: boolean;
   created_at: Date;
};
 
export type NotificationCount = {
   allNotifCount: number;
   unreadCount: number;
   typeCounts: {
     type: "CHECK_IN" | "PAYMENT" | "REWARD" | "EXPIRY" | "REMINDER";
     count: number;
   }[];
 };