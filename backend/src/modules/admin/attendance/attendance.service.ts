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
      id: true,
      check_in_time: true,
      checkout_time: true,
      status: true,
      members: {
        select: {
          fullname: true,
          gender: true,
          member_memberships: {
            select: {
              membership_plans: {
                select: {
                  plan_name: true
                }
              }
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
    attendance_id: r.id,
    name: r.members.fullname,
    gender: r.members.gender,
    status: r.status,
    plan: r.members.member_memberships[0].membership_plans.plan_name,
    checkin_time: r.check_in_time,
    checkout_time: r.checkout_time,
  }));
  
  return newResult;

};

export const markCheckoutService = async (attendance_id: number) => {
  const formatPhilippineTime = (date: Date) => {
    return new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    }).format(date);
  };

  const checkoutDateTime = new Date();

  return await prisma.$transaction(async (tx) => {
    const res = await tx.attendance.update({
      where: {
        id: attendance_id
      },
      data: {
        status: "CHECK_OUT",
        checkout_time: checkoutDateTime
      }
    });

    if (!res.checkout_time) {
      throw new Error("Checkout time was not recorded.");
    }

    const member = await tx.members.findFirst({
      where: {
        id: res.member_id
      },
      select: {
        fullname: true
      }
    });

    await tx.activities.create({
      data: {
        category: "ATTENDANCE",
        recipient_type: "ADMIN",
        title: "Checked Out",
        description: `${member?.fullname} checked out successfully at ${formatPhilippineTime(res.checkout_time)}.`,
        recipient_id: res.member_id
      }
    });

    await tx.activities.create({
      data: {
        category: "ATTENDANCE",
        recipient_type: "MEMBER",
        title: "Checked Out",
        description: "You checked out successfully.",
        recipient_id: res.member_id
      }
    });

    return {
      success: true,
      message: "Checkout successfully."
    };
  });
};