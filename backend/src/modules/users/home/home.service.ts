import { prisma } from "../../../lib/prisma";

function calculateStreak(dates: Date[]) {
   if (dates.length === 0) return 0;

   let streak = 1;

   const uniqueDates = dates.map((date) =>
      new Date(
         date.getFullYear(),
         date.getMonth(),
         date.getDate()
      ).getTime()
   );

   for (let i = 0; i < uniqueDates.length - 1; i++) {
      const current = uniqueDates[i];
      const previous = uniqueDates[i + 1];


      const difference =
         (current - previous) /
         (1000 * 60 * 60 * 24);


      if (difference === 1) {
         streak++;
      } else {
         break;
      }
   }

   return streak;
}

export const getMemberDashboardDataService = async (member_id: number) => {
   const now = new Date();
 
   const startOfMonth = new Date(
     now.getFullYear(),
     now.getMonth(),
     1
   );
 
   const member = await prisma.members.findUnique({
     where: {
       id: member_id,
     },
     select: {
         id: true,
         fullname: true,
         email: true,
         join_date: true,
         membership_plans: {
            select: {
               plan_name: true
            }
         },
         member_bills: {
            orderBy: {
              due_date: "desc"
            },
            take: 1,
            select: {
              due_date: true
            }
         },
         is_activated: true,
         points: true,
     },
   });
 
   if (!member) {
     throw new Error("Member not found");
   }
 
   const totalVisits = await prisma.attendance.count({
     where: {
       member_id: member.id,
     },
   });
 
   const thisMonth = await prisma.attendance.count({
     where: {
       member_id,
       check_in_time: {
         gte: startOfMonth,
       },
     },
   });
 
   const attendance = await prisma.attendance.findMany({
     where: {
       member_id,
     },
     orderBy: {
       check_in_time: "desc",
     },
     select: {
       check_in_time: true,
     },
   });
 
   const dayStreak = calculateStreak(
     attendance.map((item) => item.check_in_time)
   );
 
   return {
      id: member.id,
      username: member.fullname,
      join_date: member.join_date
         ? new Date(member.join_date).toLocaleDateString("en-PH", {
               timeZone: "Asia/Manila",
               month: "short",
               day: "2-digit",
               year: "numeric",
            })
         : null,
      plan: member.membership_plans.plan_name,
      expiry: member.member_bills[0]
         ? new Date(member.member_bills[0].due_date)
            .toLocaleDateString("en-PH", {
               month: "short",
               day: "2-digit",
               year: "numeric",
            })
         : null,
      status: member.is_activated ? 'Active' : 'Inactive',
      points: member.points,

      stats: {
         dayStreak,
         totalVisits,
         thisMonth,
      },
   };
};
 
export const getMemberAttendanceHistoryService = async (
  member_id: number
) => {
  const attendance = await prisma.attendance.findMany({
    where: {
      member_id,
    },
    orderBy: {
      check_in_time: "desc",
    },
    select: {
      id: true,
      check_in_time: true,
    },
  });

  return attendance.map((item) => ({
    id: item.id,

    date: item.check_in_time
      ? new Date(item.check_in_time).toLocaleDateString("en-PH", {
          timeZone: "Asia/Manila",
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      : null,

    time: item.check_in_time
      ? new Date(item.check_in_time).toLocaleTimeString("en-PH", {
          timeZone: "Asia/Manila",
          hour: "2-digit",
          minute: "2-digit",
        })
      : null,
  }));
};

export async function getRecentActivityService(member_id: number){
  const activities = await prisma.activities.findMany({
    where: {
      recepient_type: 'MEMBER',
      member_id
     },
     take:5,
     orderBy:{
       created_at:"desc"
     }
   });

   return activities.map(activity => ({
     name: activity.title,
     action: activity.description,
     time: activity.created_at?.toISOString(),
     type: activity.type
   }));
}
