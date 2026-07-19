import { prisma } from "../../../lib/prisma";

export async function getAllNotificationsService(member_id: number){
  const activities = await prisma.notifications.findMany({
    where: {
      recepient_type: 'MEMBER',
      reference_id: member_id
     },
     select: {
       id: true,
        recepient_id: true,
        type: true,
        title: true,
        message: true,
        is_read: true,
       created_at: true
     },
     orderBy:{
       created_at:"desc"
     }
   });

   return activities;
}