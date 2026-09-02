import { prisma } from "../../../lib/prisma";

export const getAllNotificationsService = async (member_id: number) => {
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

export const markNotificationAsReadService = async (notification_id: number, member_id: number) => {
	await prisma.notifications.updateMany({
		where: {
			id: notification_id,
			recipient_id: member_id,
			recipient_type: "MEMBER",
		},
		data: {
			is_read: true,
		},
	});

	return {
		success: true,
		message: "Marked as read successfully."
	}
}

export const markAllNotificationsAsReadService = async(member_id: number) => {
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
	
	if (!result) return { status: false, message: "Failed to mark all read" };

	return {
		success: true,
		message: "Mark all as read successfully."
	};
}