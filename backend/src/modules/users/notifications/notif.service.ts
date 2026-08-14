import { prisma } from "../../../lib/prisma";

export async function getAllNotificationsService(member_id: number) {
  const activities = await prisma.notifications.findMany({
    where: {
      recipient_type: 'MEMBER',
      recipient_id: member_id
     },
     select: {
        id: true,
        recipient_id: true,
        category: true,
        type: true,
        title: true,
        description: true,
        is_read: true,
        created_at: true
     },
     orderBy:{
       created_at:"desc"
     }
   });

   return activities;
}

export async function markNotificationAsReadService(
  notification_id: number,
  member_id: number
) {
  const notification = await prisma.notifications.updateMany({
    where: {
      id: notification_id,
      recipient_id: member_id,
      recipient_type: "MEMBER",
    },
    data: {
      is_read: true,
    },
  });

  return notification;
}

export async function markAllNotificationsAsReadService(member_id: number) {
	const result = await prisma.notifications.updateMany({
    where: {
      recipient_id: member_id,
			recipient_type: "MEMBER",
			is_read: false,
		},
		data: {
			is_read: true,
		},
	});
	
	if (!result) throw new Error("Failed to mark all read");

	return {
		success: true,
		message: "Mark all as read successfully."
	};
}