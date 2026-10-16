import cron from "node-cron";
import { prisma } from "../lib/prisma.js";

const autoCheckoutForgottenAttendance = async () => {
   console.log("Checking for forgotten member check-outs...");

   try {
      const now = new Date();

      const todayStart = new Date(now);
      todayStart.setHours(0, 0, 0, 0);

      const forgottenAttendance = await prisma.attendance.findMany({
         where: {
            check_in_time: {
               lt: todayStart,
            },
            checkout_time: null,
         },
         select: {
            id: true,
            member_id: true,
            check_in_time: true,
         },
      });

      if (forgottenAttendance.length === 0) {
         console.log("No forgotten check-outs found.");
         return;
      }

      await prisma.attendance.updateMany({
         where: {
            id: {
               in: forgottenAttendance.map((attendance) => attendance.id),
            },
            checkout_time: null,
         },
         data: {
            checkout_time: todayStart,
         },
      });

      console.log(
         `Automatically checked out ${forgottenAttendance.length} forgotten attendance record(s).`
      );
   } catch (error) {
      console.error("Auto checkout scheduler error:", error);
   }
};

const checkMemberAttendanceInactivity = async () => {
   console.log("Checking member attendance inactivity...");

   try {
      const now = new Date();

      const activeMembers = await prisma.member_memberships.findMany({
         where: {
            status: "Active",
         },
         select: {
            id: true,
            member_id: true,
            members: {
               select: {
                  fullname: true,
               },
            },
            membership_plans: {
               select: {
                  id: true,
                  duration: true,
                  duration_type: true,
               },
            },
         },
         distinct: ["member_id"],
      });

      for (const membership of activeMembers) {
         const membershipId = membership.id;
         const memberId = membership.member_id;
         const memberName = membership.members.fullname;
         const memberDuration = membership.membership_plans.duration;
         const memberDurationType = membership.membership_plans.duration_type;

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

         if (!lastAttendance) {
            continue;
         }

         const lastCheckIn = new Date(lastAttendance.check_in_time);
         const differenceInMs = now.getTime() - lastCheckIn.getTime();

         const daysInactive = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

         const isOneMonthMembership = memberDuration === 1 && memberDurationType === "Month";
            
         // 7 DAYS INACTIVE
         if (daysInactive >= 7 && daysInactive < 14) {
            const [
               existingMemberNotification,
               existingAdminNotification,
            ] = await Promise.all([
               prisma.notifications.findFirst({
                  where: {
                     recipient_id: memberId,
                     recipient_type: "MEMBER",
                     category: "ATTENDANCE",
                     type: "MEMBER_INACTIVE_7_DAYS",
                  },
               }),
               prisma.notifications.findFirst({
                  where: {
                     recipient_id: memberId,
                     recipient_type: "ADMIN",
                     category: "ATTENDANCE",
                     type: "MEMBER_INACTIVE_7_DAYS",
                  },
               }),
            ]);

            if (!existingMemberNotification) {
               await prisma.notifications.create({
                  data: {
                     recipient_id: memberId,
                     recipient_type: "MEMBER",
                     category: "ATTENDANCE",
                     type: "MEMBER_INACTIVE_7_DAYS",
                     title: "Time to Get Back on Track! 🔥",
                     description:
                        "It's been a week since your last visit. Your fitness journey is still waiting for you. Come back and keep your momentum going!",
                  },
               });
            }

            if (!existingAdminNotification) {
               await prisma.notifications.create({
                  data: {
                     recipient_id: memberId,
                     recipient_type: "ADMIN",
                     category: "ATTENDANCE",
                     type: "MEMBER_INACTIVE_7_DAYS",
                     title: "Member Inactive for 7 Days",
                     description: `${memberName} has not visited the gym for 7 days. Consider reaching out to encourage them to return.`,
                  },
               });
            }
         }

         // 14 DAYS INACTIVE
         if (
            daysInactive >= 14 &&
            daysInactive < 18 &&
            isOneMonthMembership
         ) {
            const [
               existingMemberNotification,
               existingAdminNotification,
            ] = await Promise.all([
               prisma.notifications.findFirst({
                  where: {
                     recipient_id: memberId,
                     recipient_type: "MEMBER",
                     category: "ATTENDANCE",
                     type: "MEMBER_INACTIVE_14_DAYS",
                  },
               }),
               prisma.notifications.findFirst({
                  where: {
                     recipient_id: memberId,
                     recipient_type: "ADMIN",
                     category: "ATTENDANCE",
                     type: "MEMBER_INACTIVE_14_DAYS",
                  },
               }),
            ]);

            if (!existingMemberNotification) {
               await prisma.notifications.create({
                  data: {
                     recipient_id: memberId,
                     recipient_type: "MEMBER",
                     category: "ATTENDANCE",
                     type: "MEMBER_INACTIVE_14_DAYS",
                     title: "Your Membership Is at Risk ⚠️",
                     description: "It's been 14 days since your last gym visit. Stay on track with your fitness goals by coming back soon. If you need help staying consistent, feel free to reach out to our gym staff.",
                  },
               });
            }

            if (!existingAdminNotification) {
               await prisma.notifications.create({
                  data: {
                     recipient_id: memberId,
                     recipient_type: "ADMIN",
                     category: "ATTENDANCE",
                     type: "MEMBER_INACTIVE_14_DAYS",
                     title: "Membership Inactivity Warning",
                     description: `${memberName} has not visited the gym for 14 days. Their engagement is now considered at risk. Consider reaching out to encourage them to return and stay consistent with their fitness goals.`,
                  },
               });
            }
         }

         // 18 DAYS INACTIVE - MARK MEMBER STATUS AS INACTIVE
         if (daysInactive >= 18 && isOneMonthMembership) {
            await prisma.notifications.create({
               data: {
                  recipient_id: memberId,
                  recipient_type: "MEMBER",
                  category: "ATTENDANCE",
                  type: "MEMBERSHIP_MARK_INACTIVE",
                  title: "You've Been Marked as Inactive!",
                  description:
                  "You've been inactive for 18 days, and we want to encourage you to get back on track! Your fitness journey doesn't stop here. Come back to the gym, don't let fear overcome you.Every workout is a new opportunity to become stronger!",
               },
            });

            await prisma.notifications.create({
               data: {
                  recipient_id: memberId,
                  recipient_type: "ADMIN",
                  category: "ATTENDANCE",
                  type: "MEMBERSHIP_MARK_INACTIVE",
                  title: "Member Marked as Inactive",
                  description: `${memberName} has been marked as inactive after 18 days without a gym visit. Consider reaching out to encourage them to return, rebuild their consistency, and continue working toward their fitness goals. Their membership status remains unchanged.`,
                },
            });
         }
      }

   } catch (error) {
      console.error(
         "Member attendance scheduler error:",
         error
      );
   }
};

export const startAttendanceCron = () => {
   // Run immediately when the server starts
   void autoCheckoutForgottenAttendance();
   void checkMemberAttendanceInactivity();

   // Run every day at 9:00 AM Philippine time
   cron.schedule(
      "0 9 * * *",
      async () => {
         await autoCheckoutForgottenAttendance();
         await checkMemberAttendanceInactivity();
      },
      {
         timezone: "Asia/Manila",
      }
   );

   console.log(
      "Attendance cron started. Auto checkout and inactivity checks run on startup and daily at 9:00 AM."
   );
};