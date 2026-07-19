import { prisma } from "../../../lib/prisma";

export const getAttendanceService = async (filters: {
  year?: number;
  month?: number;
  day?: number;
}) => {
  const { year, month, day } = filters;

  const start = new Date();
  const end = new Date();

  // 📅 YEAR filter
  if (year && !month && !day) {
    start.setFullYear(year, 0, 1);
    start.setHours(0, 0, 0, 0);

    end.setFullYear(year, 11, 31);
    end.setHours(23, 59, 59, 999);
  }

  // 📅 MONTH filter
  else if (year && month && !day) {
    start.setFullYear(year, month - 1, 1);
    start.setHours(0, 0, 0, 0);

    end.setFullYear(year, month, 0);
    end.setHours(23, 59, 59, 999);
  }

  // 📅 DAY filter
  else if (year && month && day) {
    start.setFullYear(year, month - 1, day);
    start.setHours(0, 0, 0, 0);

    end.setFullYear(year, month - 1, day);
    end.setHours(23, 59, 59, 999);
  }

  // 📌 DEFAULT: today
  else {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  const result = await prisma.attendance.findMany({
    where: {
      check_in_time: {
        gte: start,
        lte: end,
      },
    },
    select: {
      check_in_time: true,
      status: true,
      members: {
        select: {
          fullname: true,
          gender: true,
          membership_plans: {
            select: {
              plan_name: true
            }
          }
        },
      },
    },
    orderBy: {
      check_in_time: "desc",
    },
  });

  const newResult = result.map((r) => ({
    name: r.members.fullname,
    gender: r.members.gender,
    status: r.status,
    plan: r.members.membership_plans.plan_name,
    checkin_time: r.check_in_time,
  }));
  
  return newResult;

};