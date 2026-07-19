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
      }),
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