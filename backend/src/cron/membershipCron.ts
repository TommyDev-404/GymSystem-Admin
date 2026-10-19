import cron from "node-cron";
import { prisma } from "../lib/prisma.js";

const checkMemberships = async () => {
   console.log("Checking memberships...");

   try {
      const now = new Date();

      const reminderStages = [
         {
            days: 3,
            title: "Membership Expiring in 3 Days",
            getDescription: (fullname: string, planName: string) =>
               `${fullname}'s ${planName} membership expires in 3 days. Please remind the member to renew.`,
            getMemberDescription: (planName: string) =>
               `Your ${planName} membership expires in 3 days. Renew early to continue enjoying gym access and member benefits.`,
         },
         {
            days: 1,
            title: "Membership Expiring Tomorrow",
            getDescription: (
               fullname: string,
               planName: string,
               expirationDate?: string,
            ) =>
               `${fullname}'s ${planName} membership expires tomorrow at ${expirationDate}. This is your final reminder to follow up with the member.`,
            getMemberDescription: (
               planName: string,
               expirationDate?: string,
            ) =>
               `Your ${planName} membership expires tomorrow at ${expirationDate}. Please renew before ${expirationDate} to continue enjoying gym access and member benefits.`,
         },
         ];

      for (const stage of reminderStages) {
         const targetDate = new Date(now);
         targetDate.setDate(targetDate.getDate() + stage.days);
         targetDate.setHours(0, 0, 0, 0);

         const nextDay = new Date(targetDate);
         nextDay.setDate(nextDay.getDate() + 1);

         const expiringMemberships = await prisma.member_memberships.findMany({
            where: {
               status: "Active",
               end_date: {
                  gte: targetDate,
                  lt: nextDay,
               },
               start_date: {
                  lt: targetDate,
               },
               NOT: {
                  membership_plans: {
                     duration: 1,
                     duration_type: "Day",
                  },
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

         console.log(
            `Found ${expiringMemberships.length} memberships expiring in ${stage.days} day(s).`,
         );

         for (const membership of expiringMemberships) {
            const fullname = membership.members.fullname;
            const planName = membership.membership_plans.plan_name;
            
            const expirationDate = new Date(membership.end_date).toLocaleString(
               "en-PH",
               {
                  timeZone: "Asia/Manila",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
               },
            );
            
            const recipients = [
               {
                  recipient_id: membership.member_id,
                  recipient_type: "MEMBER",
                  description:
                  stage.days === 1
                     ? stage.getMemberDescription(planName, expirationDate)
                     : stage.getMemberDescription(planName),
               },
               {
                  recipient_id: membership.member_id,
                  recipient_type: "ADMIN",
                  description:
                  stage.days === 1
                     ? stage.getDescription(fullname, planName, expirationDate)
                     : stage.getDescription(fullname, planName),
               },
            ] as const;
            
            for (const recipient of recipients) {
               const existingNotification = await prisma.notifications.findFirst({
                  where: {
                  recipient_id: recipient.recipient_id,
                  recipient_type: recipient.recipient_type,
                  category: "MEMBERSHIP",
                  type: "MEMBERSHIP_EXPIRING",
                  title: stage.title,
                  },
               });
            
               if (!existingNotification) {
                  await prisma.notifications.create({
                  data: {
                     recipient_id: recipient.recipient_id,
                     recipient_type: recipient.recipient_type,
                     category: "MEMBERSHIP",
                     type: "MEMBERSHIP_EXPIRING",
                     title: stage.title,
                     description: recipient.description,
                  },
                  });
               }
            }
            }
      }

      // FIND EXPIRED MEMBERSHIPS
      const expiredMemberships = await prisma.member_memberships.findMany({
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
                     category: "MEMBERSHIP",
                  },
               }),

               prisma.notifications.findFirst({
                  where: {
                     recipient_id: membership.member_id,
                     recipient_type: "ADMIN",
                     type: "MEMBERSHIP_EXPIRED",
                     category: "MEMBERSHIP",
                  },
               }),
            ]);

            if (!existingNotificationAdmin) {
               await prisma.notifications.create({
                  data: {
                     recipient_id: membership.member_id,
                     recipient_type: "ADMIN",
                     type: "MEMBERSHIP_EXPIRED",
                     category: "MEMBERSHIP",
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
                     category: "MEMBERSHIP",
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

   // Check memberships every minute
   cron.schedule(
      "* * * * *",
      () => {
         void checkMemberships();
      },
      {
         timezone: "Asia/Manila",
      }
   );

   console.log("Membership cron started. Checking every minute.");
};