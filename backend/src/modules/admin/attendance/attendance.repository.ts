import { prisma } from "../../../lib/prisma";

export const AttendanceRepository = {
  getByDateRange: async (start: Date, end: Date) => {
    return prisma.attendance.findMany({
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
            plan: true,
          },
        },
      },
      orderBy: {
        check_in_time: "desc",
      },
    });
  },
};