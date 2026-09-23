import cron from "node-cron";
import { prisma } from "../lib/prisma";

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
         const memberDurationType =
            membership.membership_plans.duration_type;

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
         const differenceInMs =
            now.getTime() - lastCheckIn.getTime();

         const daysInactive = Math.floor(
            differenceInMs / (1000 * 60 * 60 * 24)
         );

         const isOneMonthMembership =
            memberDuration === 1 &&
            memberDurationType === "Month";

         const isLongTermMembership =
            memberDuration > 1 &&
            memberDurationType === "Month";

         // 3 DAYS INACTIVE
         if (daysInactive >= 3 && daysInactive < 7) {
            const [
               existingMemberNotification,
               existingAdminNotification,
            ] = await Promise.all([
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

         // 14 DAYS INACTIVE - MEMBERSHIP WARNING
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

            if (!existingMemberNotification) {
               await prisma.notifications.create({
                  data: {
                     recipient_id: memberId,
                     recipient_type: "MEMBER",
                     category: "MEMBERSHIP",
                     type: "MEMBER_INACTIVE_14_DAYS",
                     title: "Your Membership Is at Risk ⚠️",
                     description:
                        "You haven't visited the gym for 14 days. Please visit the gym within the next 4 days to keep your membership active.",
                  },
               });
            }

            if (!existingAdminNotification) {
               await prisma.notifications.create({
                  data: {
                     recipient_id: memberId,
                     recipient_type: "ADMIN",
                     category: "MEMBERSHIP",
                     type: "MEMBER_INACTIVE_14_DAYS",
                     title: "Membership Inactivity Warning",
                     description: `${memberName} has been inactive for 14 days. Their 1-month membership will be deactivated after 18 days of inactivity if they do not return.`,
                  },
               });
            }
         }

         // 18 DAYS INACTIVE - DEACTIVATE 1-MONTH MEMBERSHIP
         if (daysInactive >= 18 && isOneMonthMembership) {
            await prisma.member_memberships.update({
               where: {
                  id: membershipId,
                  member_id: memberId,
               },
               data: {
                  status: "Deactivated",
               },
            });

            await prisma.notifications.create({
               data: {
                  recipient_id: memberId,
                  recipient_type: "MEMBER",
                  category: "MEMBERSHIP",
                  type: "MEMBERSHIP_DEACTIVATED",
                  title: "Membership Deactivated",
                  description:
                     "Your membership has been deactivated after 18 days of inactivity. Please visit the gym or contact us to reactivate your membership.",
               },
            });

            await prisma.notifications.create({
               data: {
                  recipient_id: memberId,
                  recipient_type: "ADMIN",
                  category: "MEMBERSHIP",
                  type: "MEMBERSHIP_DEACTIVATED",
                  title: "Member Membership Deactivated",
                  description: `${memberName}'s 1-month membership has been deactivated after 18 days of inactivity.`,
               },
            });
         }

         // 28 DAYS INACTIVE - DEACTIVATE MEMBERSHIP ABOVE 1 MONTH
         if (daysInactive >= 28 && isLongTermMembership) {
            await prisma.member_memberships.update({
               where: {
                  id: membershipId,
                  member_id: memberId,
               },
               data: {
                  status: "Deactivated",
               },
            });

            await prisma.notifications.create({
               data: {
                  recipient_id: memberId,
                  recipient_type: "MEMBER",
                  category: "MEMBERSHIP",
                  type: "MEMBERSHIP_DEACTIVATED",
                  title: "Membership Deactivated",
                  description:
                     "Your membership has been deactivated after 28 days of inactivity. Please visit the gym or contact us to reactivate your membership.",
               },
            });

            await prisma.notifications.create({
               data: {
                  recipient_id: memberId,
                  recipient_type: "ADMIN",
                  category: "MEMBERSHIP",
                  type: "MEMBERSHIP_DEACTIVATED",
                  title: "Member Membership Deactivated",
                  description: `${memberName}'s membership has been deactivated after 28 days of inactivity.`,
               },
            });
         }
      }

      console.log("Member inactivity check completed.");
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