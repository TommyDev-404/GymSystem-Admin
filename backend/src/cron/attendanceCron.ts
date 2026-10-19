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
         OR: [
           {
             morning_checkin_time: {
               lt: todayStart,
             },
             morning_checkout_time: null,
           },
           {
             afternoon_checkin_time: {
               lt: todayStart,
             },
             afternoon_checkout_time: null,
           },
         ],
       },
       select: {
         id: true,
         morning_checkin_time: true,
         morning_checkout_time: true,
         afternoon_checkin_time: true,
         afternoon_checkout_time: true,
       },
     });
 
     if (forgottenAttendance.length === 0) {
       console.log("No forgotten check-outs found.");
       return;
     }
 
     let morningCheckouts = 0;
     let afternoonCheckouts = 0;
 
     for (const attendance of forgottenAttendance) {
       const data: {
         morning_checkout_time?: Date;
         afternoon_checkout_time?: Date;
       } = {};
 
       if (
         attendance.morning_checkin_time &&
         attendance.morning_checkin_time < todayStart &&
         !attendance.morning_checkout_time
       ) {
         data.morning_checkout_time = todayStart;
         morningCheckouts++;
       }
 
       if (
         attendance.afternoon_checkin_time &&
         attendance.afternoon_checkin_time < todayStart &&
         !attendance.afternoon_checkout_time
       ) {
         data.afternoon_checkout_time = todayStart;
         afternoonCheckouts++;
       }
 
       if (Object.keys(data).length > 0) {
         await prisma.attendance.update({
           where: { id: attendance.id },
           data,
         });
       }
     }
 
     console.log(
       `Automatically checked out ${morningCheckouts} forgotten morning session(s) and ${afternoonCheckouts} forgotten afternoon session(s).`
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
       const memberId = membership.member_id;
       const memberName = membership.members.fullname;
 
       const [latestMorning, latestAfternoon] = await Promise.all([
         prisma.attendance.findFirst({
           where: {
             member_id: memberId,
             morning_checkin_time: {
               not: null,
             },
           },
           orderBy: {
             morning_checkin_time: "desc",
           },
           select: {
             morning_checkin_time: true,
           },
         }),
 
         prisma.attendance.findFirst({
           where: {
             member_id: memberId,
             afternoon_checkin_time: {
               not: null,
             },
           },
           orderBy: {
             afternoon_checkin_time: "desc",
           },
           select: {
             afternoon_checkin_time: true,
           },
         }),
       ]);
 
       const checkInTimes = [
         latestMorning?.morning_checkin_time,
         latestAfternoon?.afternoon_checkin_time,
       ].filter((time): time is Date => time != null);
 
       if (checkInTimes.length === 0) {
         continue;
       }
 
       const lastCheckIn = new Date(
         Math.max(...checkInTimes.map((time) => time.getTime())),
       );
 
       const differenceInMs = now.getTime() - lastCheckIn.getTime();
 
       const daysInactive = Math.floor(
         differenceInMs / (1000 * 60 * 60 * 24),
       );
 
       const ensureNotification = async ({
         recipientType,
         type,
         title,
         description,
       }: {
         recipientType: "MEMBER" | "ADMIN";
         type: "MEMBER_INACTIVE_14_DAYS" | "MEMBERSHIP_MARK_INACTIVE";
         title: string;
         description: string;
       }) => {
         const existingNotification =
           await prisma.notifications.findFirst({
             where: {
               recipient_id: memberId,
               recipient_type: recipientType,
               category: "ATTENDANCE",
               type,
             },
           });
 
         if (!existingNotification) {
           await prisma.notifications.create({
             data: {
               recipient_id: memberId,
               recipient_type: recipientType,
               category: "ATTENDANCE",
               type,
               title,
               description,
             },
           });
         }
       };
 
       // 12 DAYS OR MORE WITHOUT A VISIT
       // Also runs for members who have already reached 15+ days.
       if (daysInactive >= 12) {
         await Promise.all([
           ensureNotification({
             recipientType: "MEMBER",
             type: "MEMBER_INACTIVE_14_DAYS",
             title: "We Miss You!",
             description:
               "You haven't visited the gym in 12 days. If you remain inactive for 15 days, your membership engagement status will be marked as inactive. Visit the gym soon to stay on track with your fitness goals!",
           }),
 
           ensureNotification({
             recipientType: "ADMIN",
             type: "MEMBER_INACTIVE_14_DAYS",
             title: "Membership Inactivity Warning",
             description: `${memberName} has not visited the gym for at least 12 days. If they reach 15 days without visiting, their engagement status will be marked as inactive.`,
           }),
         ]);
       }
 
       // 15 DAYS OR MORE WITHOUT A VISIT
       // Create the inactive notifications only if they do not exist.
       if (daysInactive >= 15) {
         await Promise.all([
           ensureNotification({
             recipientType: "MEMBER",
             type: "MEMBERSHIP_MARK_INACTIVE",
             title: "You've Been Marked as Inactive!",
             description:
               "You've been marked as inactive due to 15 days without a gym visit. Come back and get back on track with your fitness goals. Every workout is a new opportunity to grow stronger!",
           }),
 
           ensureNotification({
             recipientType: "ADMIN",
             type: "MEMBERSHIP_MARK_INACTIVE",
             title: "Member Marked as Inactive",
             description: `${memberName} has been marked as inactive after 15 days without a gym visit. Consider reaching out to encourage them to return. Their membership status remains unchanged.`,
           }),
         ]);
       }
     }
   } catch (error) {
     console.error("Member attendance scheduler error:", error);
   }
 };

export const startAttendanceCron = () => {
   // Run immediately when the server starts
   void autoCheckoutForgottenAttendance();
   void checkMemberAttendanceInactivity();

   // Run every minute
   cron.schedule(
      "* * * * *",
      async () => {
         await autoCheckoutForgottenAttendance();
         await checkMemberAttendanceInactivity();
      },
      {
         timezone: "Asia/Manila",
      }
   );

   console.log(
      "Attendance cron started. Auto checkout and inactivity checks run on startup and every minute."
   );
};