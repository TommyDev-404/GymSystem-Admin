
export const filterTypes = [
	"All",
	"PAYMENT",
	"MEMBERSHIP",
	"REWARD",
	"MEMBER",
	"ATTENDANCE",
] as const;

export type FilterType = (typeof filterTypes)[number];

export type Notifications = {
   id: number;
   recipient_id: number;
   category: FilterType;
   title: string;
   description: string;
   is_read: boolean;
   created_at: Date;
};
 
export type NotificationCount = {
   allNotifCount: number;
   unreadCount: number;
   typeCounts: {
     category: FilterType;
     count: number;
   }[];
};
 
