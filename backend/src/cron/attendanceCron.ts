import cron from "node-cron";
import { prisma } from "../lib/prisma";

export const startAttendanceCron = () => {
   // Run every day at 9:00 AM Philippine time
   cron.schedule(
      "0 9 * * *",
      async () => {
         console.log("Checking member attendance inactivity...");

         try {
            const now = new Date();

            // Get all members with an active membership
            const activeMembers = await prisma.member_memberships.findMany({
               where: {
                  status: "Active",
               },
               select: {
                  member_id: true,

                  members: {
                     select: {
                        fullname: true,
                     },
                  },
               },
               distinct: ["member_id"],
            });

            for (const membership of activeMembers) {
               const memberId = membership.member_id;
               const memberName = membership.members.fullname;

               // Get the member's most recent attendance
               const lastAttendance = await prisma.attendance.findFirst({
                  where: {
                     member_id: memberId,
                  },
                  orderBy: {
                     check_in_time: "desc",
                  },
                  select: {
                     check_in_time: true,
                  },
               });

               // If the member has never attended, skip for now.
               // You can handle new members separately if needed.
               if (!lastAttendance) {
                  continue;
               }

               // Calculate days since last attendance
               const lastCheckIn = new Date(lastAttendance.check_in_time);
               const differenceInMs = now.getTime() - lastCheckIn.getTime();
               const daysInactive = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

               // ============================================
               // 3 DAYS INACTIVE
               // ============================================

               if (daysInactive >= 3 && daysInactive < 7) {
                  const [existingMemberNotification, existingAdminNotification] = await Promise.all([
                     prisma.notifications.findFirst({
                        where: {
                           recipient_id: memberId,
                           recipient_type: "MEMBER",
                           type: "MEMBER_INACTIVE_3_DAYS",
                        },
                     }),

                     prisma.notifications.findFirst({
                        where: {
                           recipient_id: memberId,
                           recipient_type: "ADMIN",
                           type: "MEMBER_INACTIVE_3_DAYS",
                        },
                     }),
                  ]);

                  // Member notification
                  if (!existingMemberNotification) {
                     await prisma.notifications.create({
                        data: {
                           recipient_id: memberId,
                           recipient_type: "MEMBER",
                           type: "MEMBER_INACTIVE_3_DAYS",
                           title: "We Miss You! 💪",
                           description:
                              "We haven't seen you at the gym recently. Keep working toward your fitness goals and come back for your next workout!",
                        },
                     });
                  }

                  // Admin notification
                  if (!existingAdminNotification) {
                     await prisma.notifications.create({
                        data: {
                           recipient_id: memberId,
                           recipient_type: "ADMIN",
                           type: "MEMBER_INACTIVE_3_DAYS",
                           title: "Member Has Been Inactive",
                           description: `${memberName} has not visited the gym for 3 days. Consider encouraging them to return.`,
                        },
                     });
                  }
               }

               // ============================================
               // 7 DAYS INACTIVE
               // ============================================

               if (daysInactive >= 7 && daysInactive < 14) {
                  const [
                     existingMemberNotification,
                     existingAdminNotification,
                  ] = await Promise.all([
                     prisma.notifications.findFirst({
                        where: {
                           recipient_id: memberId,
                           recipient_type: "MEMBER",
                           type: "MEMBER_INACTIVE_7_DAYS",
                        },
                     }),

                     prisma.notifications.findFirst({
                        where: {
                           recipient_id: memberId,
                           recipient_type: "ADMIN",
                           type: "MEMBER_INACTIVE_7_DAYS",
                        },
                     }),
                  ]);

                  // Member notification
                  if (!existingMemberNotification) {
                     await prisma.notifications.create({
                        data: {
                           recipient_id: memberId,
                           recipient_type: "MEMBER",
                           type: "MEMBER_INACTIVE_7_DAYS",
                           title: "Time to Get Back on Track! 🔥",
                           description:
                              "It's been a week since your last visit. Your fitness journey is still waiting for you. Come back and keep your momentum going!",
                        },
                     });
                  }

                  // Admin notification
                  if (!existingAdminNotification) {
                     await prisma.notifications.create({
                        data: {
                           recipient_id: memberId,
                           recipient_type: "ADMIN",
                           type: "MEMBER_INACTIVE_7_DAYS",
                           title: "Member Inactive for 7 Days",
                           description: `${memberName} has not visited the gym for 7 days. Consider reaching out to encourage them to return.`,
                        },
                     });
                  }
               }

               // ============================================
               // 14 DAYS INACTIVE
               // ============================================

               if (daysInactive >= 14) {
                  const [
                     existingMemberNotification,
                     existingAdminNotification,
                  ] = await Promise.all([
                     prisma.notifications.findFirst({
                        where: {
                           recipient_id: memberId,
                           recipient_type: "MEMBER",
                           type: "MEMBER_INACTIVE_14_DAYS",
                        },
                     }),

                     prisma.notifications.findFirst({
                        where: {
                           recipient_id: memberId,
                           recipient_type: "ADMIN",
                           type: "MEMBER_INACTIVE_14_DAYS",
                        },
                     }),
                  ]);

                  // Member notification
                  if (!existingMemberNotification) {
                     await prisma.notifications.create({
                        data: {
                           recipient_id: memberId,
                           recipient_type: "MEMBER",
                           type: "MEMBER_INACTIVE_14_DAYS",
                           title: "We'd Love to See You Back! ❤️",
                           description:
                              "It's been a while since your last visit. Don't give up on your fitness goals. Come back to the gym and get back into your routine!",
                        },
                     });
                  }

                  // Admin notification
                  if (!existingAdminNotification) {
                     await prisma.notifications.create({
                        data: {
                           recipient_id: memberId,
                           recipient_type: "ADMIN",
                           type: "MEMBER_INACTIVE_14_DAYS",
                           title: "Member Inactive for 14 Days",
                           description: `${memberName} has not visited the gym for 14 days. Consider following up with the member to encourage them to return.`,
                        },
                     });
                  }
               }
            }

            console.log("Member inactivity check completed.");
         } catch (error) {
            console.error(
               "Member attendance scheduler error:",
               error
            );
         }
      },
      {
         timezone: "Asia/Manila",
      }
   );
};