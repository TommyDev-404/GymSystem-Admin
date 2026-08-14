import { prisma } from "../../../lib/prisma";

export async function getAllNotificationsService(data: { category: any }) {
	return await prisma.notifications.findMany({
		where: {
			recipient_type: "ADMIN",
			...(data.category && data.category !== "All" && {
				category: data.category,
			})
		},
		select: {
			id: true,
			recipient_id: true,
			category: true,
			title: true,
			description: true,
			is_read: true,
			created_at: true,
		},
		orderBy: {
			created_at: "desc",
		},
	});
}

export async function getNotificationCountService() {
	const [unreadCount, allNotifCount, typeCounts] = await Promise.all([
		// Total unread notifications
		prisma.notifications.count({
			where: {
				recipient_type: "ADMIN",
				is_read: false,
			},
		}),

		// Total notifications
		prisma.notifications.count({
			where: {
				recipient_type: "ADMIN",
			},
		}),

		// Notifications grouped by type
		prisma.notifications.groupBy({
			by: ["category"],
			where: {
				recipient_type: "ADMIN",
			},
			_count: {
				category: true,
			},
		}),
	]);

	return {
		unreadCount,
		allNotifCount,
		typeCounts: typeCounts.map((item) => ({
			category: item.category,
			count: item._count.category,
		})),
	};
}

export async function markNotificationAsReadService(id: number) {
	const result = await prisma.notifications.update({
		where: {
			id,
		},
		data: {
			is_read: true,
		}
	});

	if (!result) throw new Error("Failed to mark read");

	return {
		success: true,
		message: "Mark as read successfully."
	};
}

export async function markAllNotificationsAsReadService() {
	const result = await prisma.notifications.updateMany({
		where: {
			recipient_type: "ADMIN",
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

export async function deleteNotificationService(id: number) {
	const result = await prisma.notifications.delete({
		where: {
			id,
		},
	});
	
	if (!result) throw new Error("Failed to remove notification");

	return {
		success: true,
		message: "Notification remove successfully."
	};
}