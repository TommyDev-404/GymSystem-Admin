import cron from "node-cron";
import { prisma } from "../lib/prisma";

const checkMemberships = async () => {
   console.log("Checking memberships...");

   try {
      const now = new Date();

      // FIND MEMBERSHIPS EXPIRING TOMORROW
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const tomorrowStart = new Date(tomorrow);
      tomorrowStart.setHours(0, 0, 0, 0);

      const tomorrowEnd = new Date(tomorrow);
      tomorrowEnd.setHours(23, 59, 59, 999);

      const expiringMembershipsTomorrow =
         await prisma.member_memberships.findMany({
            where: {
               status: "Active",
               end_date: {
                  gte: tomorrowStart,
                  lte: tomorrowEnd,
               },
            },
            include: {
               members: {
                  select: {
                     fullname: true,
                  },
               },
               membership_plans: {
                  select: {
                     plan_name: true,
                  },
               },
            },
         });

      // CREATE EXPIRING NOTIFICATIONS
      for (const membership of expiringMembershipsTomorrow) {
         const [
            existingNotificationMember,
            existingNotificationAdmin,
         ] = await Promise.all([
            prisma.notifications.findFirst({
               where: {
                  recipient_id: membership.member_id,
                  recipient_type: "MEMBER",
                  type: "MEMBERSHIP_EXPIRING",
               },
            }),

            prisma.notifications.findFirst({
               where: {
                  recipient_id: membership.member_id,
                  recipient_type: "ADMIN",
                  type: "MEMBERSHIP_EXPIRING",
               },
            }),
         ]);

         if (!existingNotificationAdmin) {
            await prisma.notifications.create({
               data: {
                  recipient_id: membership.member_id,
                  recipient_type: "ADMIN",
                  type: "MEMBERSHIP_EXPIRING",
                  title: "Membership Expiring Tomorrow",
                  description: `${membership.members.fullname}'s membership expires tomorrow.`,
               },
            });
         }

         if (!existingNotificationMember) {
            await prisma.notifications.create({
               data: {
                  recipient_id: membership.member_id,
                  recipient_type: "MEMBER",
                  type: "MEMBERSHIP_EXPIRING",
                  title: "Membership Expiring Tomorrow",
                  description: `Your ${membership.membership_plans.plan_name} membership expires tomorrow. Renew it before it expires.`,
               },
            });
         }
      }

      // FIND EXPIRED MEMBERSHIPS
      const expiredMemberships =
         await prisma.member_memberships.findMany({
            where: {
               status: "Active",
               end_date: {
                  lte: now,
               },
            },
            include: {
               members: {
                  select: {
                     fullname: true,
                  },
               },
               membership_plans: {
                  select: {
                     plan_name: true,
                  },
               },
            },
         });
      
      console.log("EXpired: ", expiredMemberships);

      // MARK MEMBERSHIPS AS EXPIRED
      if (expiredMemberships.length > 0) {
         await prisma.member_memberships.updateMany({
            where: {
               id: {
                  in: expiredMemberships.map(
                     (membership) => membership.id
                  ),
               },
            },
            data: {
               status: "Expired",
            },
         });

         // CREATE EXPIRED NOTIFICATIONS
         for (const membership of expiredMemberships) {
            const [
               existingNotificationMember,
               existingNotificationAdmin,
            ] = await Promise.all([
               prisma.notifications.findFirst({
                  where: {
                     recipient_id: membership.member_id,
                     recipient_type: "MEMBER",
                     type: "MEMBERSHIP_EXPIRED",
                  },
               }),

               prisma.notifications.findFirst({
                  where: {
                     recipient_id: membership.member_id,
                     recipient_type: "ADMIN",
                     type: "MEMBERSHIP_EXPIRED",
                  },
               }),
            ]);

            if (!existingNotificationAdmin) {
               await prisma.notifications.create({
                  data: {
                     recipient_id: membership.member_id,
                     recipient_type: "ADMIN",
                     type: "MEMBERSHIP_EXPIRED",
                     title: "Membership Expired",
                     description: `${membership.members.fullname}'s membership has expired. Please follow up with the member for renewal.`,
                  },
               });
            }

            if (!existingNotificationMember) {
               await prisma.notifications.create({
                  data: {
                     recipient_id: membership.member_id,
                     recipient_type: "MEMBER",
                     type: "MEMBERSHIP_EXPIRED",
                     title: "Membership Expired",
                     description: `Your ${membership.membership_plans.plan_name} membership has expired. Renew your membership to continue enjoying gym access and member benefits.`,
                  },
               });
            }
         }
      }

      console.log("Membership check completed.");
   } catch (error) {
      console.error("Membership scheduler error:", error);
   }
};

export const startMembershipCron = () => {
   // Run immediately when the server starts
   void checkMemberships();

   // Run every midnight
   cron.schedule(
      "0 0 * * *",
      () => {
         void checkMemberships();
      },
      {
         timezone: "Asia/Manila",
      }
   );

   console.log("Membership cron started.");
};