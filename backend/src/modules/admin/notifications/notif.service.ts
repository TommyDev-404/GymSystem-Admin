import { prisma } from "../../../lib/prisma";
import { CreatePaymentNotif } from "./notif.types";

export const createPaymentNotifForMemberService = async (data: CreatePaymentNotif) => {
   const result = await prisma.notifications.create({
      data: {
         recepient_id: data.member_id,
         recepient_type: 'MEMBER',
         type: 'PAYMENT',
         title: "Payment Recorded",
         message: data.message,
         reference_id: data.payment_id,
         reference_type: 'PAYMENT'
      }
   });

   if (!result) throw new Error();

   return {
      success: true,
      message: "Notification created successfully"
   }
};

export async function getAllNotificationsService(data: { type?: any }) {
  const activities = await prisma.notifications.findMany({
    where: {
      recepient_type: "ADMIN",
      ...(data.type && data.type !== "All" && {
        type: data.type,
      })
    },
    select: {
      id: true,
      recepient_id: true,
      type: true,
      title: true,
      message: true,
      is_read: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return activities;
}

export async function getNotificationCountService() {
  const [unreadCount, allNotifCount, typeCounts] = await Promise.all([
    // Total unread notifications
    prisma.notifications.count({
      where: {
        recepient_type: "ADMIN",
        is_read: false,
      },
    }),

    // Total notifications
    prisma.notifications.count({
      where: {
        recepient_type: "ADMIN",
      },
    }),

    // Notifications grouped by type
    prisma.notifications.groupBy({
      by: ["type"],
      where: {
        recepient_type: "ADMIN",
      },
      _count: {
        type: true,
      },
    }),
  ]);

  return {
    unreadCount,
    allNotifCount,
    typeCounts: typeCounts.map((item) => ({
      type: item.type,
      count: item._count.type,
    })),
  };
}

export async function markNotificationAsReadService(id: number) {
  await prisma.notifications.update({
    where: {
      id,
    },
    data: {
      is_read: true,
    },
    select: {
      id: true,
      is_read: true,
    },
  });

  return {
    success: true,
    message: "Mark as read successfully."
  };
}

export async function markAllNotificationsAsReadService() {
  const result = await prisma.notifications.updateMany({
    where: {
      recepient_type: "ADMIN",
      is_read: false,
    },
    data: {
      is_read: true,
    },
  });

  return {
    updatedCount: result.count,
  };
}

export async function deleteNotificationService(id: number) {
  const result = await prisma.notifications.delete({
    where: {
      id,
    },
  });

  return result;
}