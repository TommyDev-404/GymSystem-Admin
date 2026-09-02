import { prisma } from "../../../lib/prisma";

export const getSummaryDataService = async () => {
   const now = new Date();

   const startOfCurrentMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
   );

   const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
   );

   const startOfNextMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1
   );

   const startOfToday = new Date();
   startOfToday.setHours(0, 0, 0, 0);

   const endOfToday = new Date();
   endOfToday.setHours(23, 59, 59, 999);

   const startOfYesterday = new Date();
   startOfYesterday.setDate(startOfYesterday.getDate() - 1);
   startOfYesterday.setHours(0, 0, 0, 0);

   const endOfYesterday = new Date(startOfYesterday);
   endOfYesterday.setHours(23, 59, 59, 999);

   const getTrend = (current: number, previous: number) => {
      if (previous === 0) {
         return current > 0 ? 100 : 0;
      }

      return Number(
         (((current - previous) / previous) * 100).toFixed(1)
      );
   };

   return await prisma.$transaction(async (tx) => {
      const totalMembers = await tx.members.count();

      // New members this month
      const newMembersThisMonth = await tx.members.count({
         where: {
            join_date: {
               gte: startOfCurrentMonth
            }
         }
      });

      // New members previous month
      const newMembersPreviousMonth = await tx.members.count({
         where: {
            join_date: {
               gte: startOfPreviousMonth,
               lt: startOfCurrentMonth
            }
         }
      });

      const memberTrend = getTrend(
         newMembersThisMonth,
         newMembersPreviousMonth
      );

      // Today's attendance
      const currentlyPresent = await tx.attendance.count({
         where: {
            status: "CHECK_IN",
            check_in_time: {
               gte: startOfToday,
               lte: endOfToday
            }
         }
      });

      // Yesterday attendance
      const yesterdayPresent = await tx.attendance.count({
         where: {
            status: "CHECK_IN",
            check_in_time: {
               gte: startOfYesterday,
               lte: endOfYesterday
            }
         }
      });

      const presentTrend = getTrend(
         currentlyPresent,
         yesterdayPresent
      );

      // Attendance by gender (all time)
      const totalMalePresent = await tx.attendance.count({
         where: {
            status: "CHECK_IN",
            members: {
               gender: "Male"
            },
            check_in_time: {
               gte: startOfToday,
               lte: endOfToday
            }
         }
      });

      const totalFemalePresent = await tx.attendance.count({
         where: {
            status: "CHECK_IN",
            members: {
               gender: "Female"
            },
            check_in_time: {
               gte: startOfToday,
               lte: endOfToday
            }
         }
      });

      // Expired memberships - current month
      const expiredMembershipsThisMonth = await tx.member_memberships.count({
         where: {
            status: "Expired",
            end_date: {
               gte: startOfCurrentMonth,
               lt: startOfNextMonth,
            },
         },
      });

      // Expired memberships - previous month
      const expiredMembershipsPreviousMonth = await tx.member_memberships.count({
         where: {
            status: "Expired",
            end_date: {
               gte: startOfPreviousMonth,
               lt: startOfCurrentMonth,
            },
         },
      });

      const expiredMembershipTrend = expiredMembershipsThisMonth - expiredMembershipsPreviousMonth;
      
      // Payments by this month
      const totalPaidThisMonth = await tx.payments.aggregate({
         _sum: { amount: true }, 
         where: {
            status: "Paid",
            paid_at: {
               gte: startOfCurrentMonth
            }
         }
      })

      const totalPaidPreviousMonth = await tx.payments.aggregate({
         _sum: { amount: true }, 
         where: {
            status: "Paid",
            paid_at: {
               gte: startOfPreviousMonth,
               lt: startOfCurrentMonth
            }
         }
      })

      const paymentTrendThisMonth = getTrend(
         Number(totalPaidThisMonth._sum.amount ?? 0),
         Number(totalPaidPreviousMonth._sum.amount ?? 0)
      );

      return {
         totalMembers,
         newMembersThisMonth,
         memberTrend,
         currentlyPresent,
         presentTrend,
         totalMalePresent,
         totalFemalePresent,
         totalPaidThisMonth: totalPaidThisMonth._sum.amount ?? 0,
         paymentTrendThisMonth,
         totalExpiredMemberships: expiredMembershipsThisMonth,
         expiredMembershipTrend
      };
   });

};

export async function getMonthlyRevenueTrendService() {
   return await prisma.$queryRaw<
      { month: string; revenue: number }[]
   >`
      WITH RECURSIVE months AS (
         SELECT DATE_FORMAT(CURDATE(), '%Y-01-01') AS month_start
      
         UNION ALL
      
         SELECT DATE_ADD(month_start, INTERVAL 1 MONTH)
         FROM months
         WHERE month_start < DATE_FORMAT(CURDATE(), '%Y-%m-01')
      )
      
      SELECT
         DATE_FORMAT(m.month_start, '%b') AS month,
         COALESCE(SUM(p.amount), 0) AS revenue
      FROM months m
      LEFT JOIN payments p
         ON YEAR(p.paid_at) = YEAR(m.month_start)
         AND MONTH(p.paid_at) = MONTH(m.month_start)
      GROUP BY m.month_start
      ORDER BY m.month_start;
   `;
}

export const getMembershipsExpiringSoonService = async () => {
   const now = new Date();

   const todayStart = new Date(now);
   todayStart.setHours(0, 0, 0, 0);

   const sevenDaysLater = new Date(todayStart);
   sevenDaysLater.setDate(sevenDaysLater.getDate() + 7);
   sevenDaysLater.setHours(23, 59, 59, 999);

   const memberships = await prisma.member_memberships.findMany({
      where: {
         status: "Active",
         end_date: {
            gte: todayStart,
            lte: sevenDaysLater,
         },
      },

      select: {
         id: true,
         end_date: true,

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

      orderBy: {
         end_date: "asc",
      },

      take: 5,
   });

   return memberships.map((membership) => {
      const endDate = new Date(membership.end_date);

      const diffMs = endDate.getTime() - todayStart.getTime();
      const daysRemaining = Math.ceil(
         diffMs / (1000 * 60 * 60 * 24)
      );

      return {
         id: membership.id,
         fullname: membership.members.fullname,
         planName: membership.membership_plans.plan_name,
         endDate: membership.end_date,
         daysRemaining,
      };
   });
};

export async function getWeeklyGuestAttendanceService() {
   const data = await prisma.$queryRaw<
      {
      day: string;
      count: number;
      }[]
   >`
      WITH RECURSIVE days AS (
      SELECT DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) AS attendance_date

      UNION ALL

      SELECT DATE_ADD(attendance_date, INTERVAL 1 DAY)
      FROM days
      WHERE attendance_date < DATE_ADD(
         DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY),
         INTERVAL 6 DAY
      )
      )

      SELECT
      DAYNAME(d.attendance_date) AS day,
      COALESCE(COUNT(a.id), 0) AS count
      FROM days d
      LEFT JOIN attendance a
      ON DATE(a.check_in_time) = d.attendance_date
      AND a.member_id IS NOT NULL
      GROUP BY d.attendance_date
      ORDER BY d.attendance_date;
   `;

   return data.map(item => ({
      day: item.day,
      presentMembers: Number(item.count),
   }));
}

export async function getMembershipStatusService() {
   const data = await prisma.member_memberships.groupBy({
      by: ["status"],
      _count: {
         status: true,
      },
   });
 
   const statusMap = new Map(
      data.map((item) => [
         item.status,
         item._count.status,
      ])
   );
 
   return [
      {
         name: "Active",
         value: statusMap.get("Active") ?? 0,
      },
      {
         name: "Expired",
         value: statusMap.get("Expired") ?? 0,
      }
   ];
}

export async function getGenderDistributionService() {
   const data = await prisma.members.groupBy({
      by: ["gender"],
      _count: {
         gender: true,
      },
   });
 
   const genderMap = new Map(
      data.map((item) => [
         item.gender,
         item._count.gender,
      ])
   );
 
   return [
      {
         name: "Male",
         value: genderMap.get("Male") ?? 0,
      },
      {
         name: "Female",
         value: genderMap.get("Female") ?? 0,
      },
   ];
}

export async function getTopClaimedRewardsService() {
   const rewards = await prisma.reward_redemptions.groupBy({
      by: ["reward_id"],
      where: {
        status: "Claimed",
      },
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
      take: 5,
    });
 
   const rewardsWithNames = await Promise.all(
     rewards.map(async (reward) => {
       const rewardData = await prisma.rewards.findUnique({
         where: {
           id: reward.reward_id,
         },
         select: {
           name: true,
         },
       });
 
       return {
         name: rewardData?.name,
         claimed: reward._count.id,
       };
     })
   );
 
   return rewardsWithNames;
}
 
export async function getRecentActivityService(){
   const activities = await prisma.activities.findMany({
      where: {
         recipient_type: 'ADMIN'
      },
      take:5,
      orderBy:{ created_at:"desc"},
      include:{
         members:{
            select:{
               fullname:true
            }
         },
      }
   });

   return activities.map(activity => ({
      name: activity.title,
      action: activity.description,
      time: activity.created_at?.toISOString(),
      avatar: activity.members?.fullname
         ?.split(" ")
         .map(x => x[0])
         .join("")
   }));
}