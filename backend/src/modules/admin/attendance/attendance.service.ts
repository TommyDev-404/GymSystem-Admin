import { prisma } from "../../../lib/prisma.js";
import { getIO } from "../../../lib/socket.js";

export const getAttendanceService = async (filters: {
  year?: number;
  month?: number;
  day?: number;
}) => {
  const { year, month, day } = filters;

  const start = new Date();
  const end = new Date();

  if (year && !month && !day) {
    start.setFullYear(year, 0, 1);
    start.setHours(0, 0, 0, 0);

    end.setFullYear(year + 1, 0, 1);
    end.setHours(0, 0, 0, 0);
  } else if (year && month && !day) {
    start.setFullYear(year, month - 1, 1);
    start.setHours(0, 0, 0, 0);

    end.setFullYear(year, month, 1);
    end.setHours(0, 0, 0, 0);
  } else if (year && month && day) {
    start.setFullYear(year, month - 1, day);
    start.setHours(0, 0, 0, 0);

    end.setTime(start.getTime());
    end.setDate(end.getDate() + 1);
  } else {
    start.setHours(0, 0, 0, 0);

    end.setTime(start.getTime());
    end.setDate(end.getDate() + 1);
  }

  const result = await prisma.attendance.findMany({
    where: {
      OR: [
        {
          morning_checkin_time: {
            gte: start,
            lt: end,
          },
        },
        {
          afternoon_checkin_time: {
            gte: start,
            lt: end,
          },
        },
      ],
    },
    select: {
      id: true,
      morning_checkin_time: true,
      morning_checkout_time: true,
      afternoon_checkin_time: true,
      afternoon_checkout_time: true,
      status: true,
      members: {
        select: {
          fullname: true,
          gender: true,
          member_memberships: {
            select: {
              id: true,
              start_date: true,
              end_date: true,
              status: true,
              created_at: true,
              membership_plans: {
                select: {
                  id: true,
                  plan_name: true,
                  daily_hours_limit: true,
                  duration: true,
                  duration_type: true,
                  price: true
                },
              },
            },
            orderBy: {
              created_at: "desc",
            },
            take: 1,
          },
        },
      },
    },
    orderBy: [
      {
        afternoon_checkin_time: "desc",
      },
      {
        morning_checkin_time: "desc",
      },
    ],
  });

  return result.map((r) => {
    const latestMembership = r.members.member_memberships[0] ?? null;

    return {
      attendance_id: r.id,
      name: r.members.fullname,
      gender: r.members.gender,
      status: r.status,

      plan: latestMembership?.membership_plans.plan_name ?? "No Plan",
      plan_id: latestMembership?.membership_plans.id ?? null,
      membership_start: latestMembership?.start_date ?? null,
      membership_end: latestMembership?.end_date ?? null,
      membership_status: latestMembership?.status ?? null,
      daily_limit: latestMembership?.membership_plans.daily_hours_limit ?? 0,
      duration: latestMembership.membership_plans.duration,
      duration_type: latestMembership.membership_plans.duration_type,
      price: latestMembership.membership_plans.price,

      morning_checkin_time: r.morning_checkin_time,
      morning_checkout_time: r.morning_checkout_time,

      afternoon_checkin_time: r.afternoon_checkin_time,
      afternoon_checkout_time: r.afternoon_checkout_time,
    };
  });
};

export const markCheckoutService = async (
  attendance_id: number,
  sessionType: "MORNING" | "AFTERNOON"
) => {
  const formatPhilippineTime = (date: Date) =>
    new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(date);

  const checkoutDateTime = new Date();

  const checkoutField =
    sessionType === "MORNING"
      ? "morning_checkout_time"
      : "afternoon_checkout_time";

  const checkinField =
    sessionType === "MORNING"
      ? "morning_checkin_time"
      : "afternoon_checkin_time";

  const result = await prisma.$transaction(async (tx) => {
    const attendance = await tx.attendance.findUnique({
      where: { id: attendance_id },
      select: {
        id: true,
        member_id: true,
        morning_checkin_time: true,
        morning_checkout_time: true,
        afternoon_checkin_time: true,
        afternoon_checkout_time: true,
      },
    });

    if (!attendance) {
      throw new Error("Attendance record not found.");
    }

    if (!attendance[checkinField]) {
      throw new Error(`${sessionType} check-in has not been recorded.`);
    }

    if (attendance[checkoutField]) {
      throw new Error(`${sessionType} checkout has already been recorded.`);
    }

    const res = await tx.attendance.update({
      where: { id: attendance_id },
      data: {
        [checkoutField]: checkoutDateTime,
      },
    });

    const member = await tx.members.findUnique({
      where: { id: res.member_id },
      select: { fullname: true },
    });

    const formattedTime = formatPhilippineTime(checkoutDateTime);

    await tx.activities.createMany({
      data: [
        {
          category: "ATTENDANCE",
          recipient_type: "ADMIN",
          title: "Checked Out",
          description: `${member?.fullname ?? "Member"} checked out successfully for the ${sessionType.toLowerCase()} session at ${formattedTime}.`,
          recipient_id: res.member_id,
        },
        {
          category: "ATTENDANCE",
          recipient_type: "MEMBER",
          title: "Checked Out",
          description: `You checked out successfully for the ${sessionType.toLowerCase()} session.`,
          recipient_id: res.member_id,
        },
      ],
    });

    await tx.notifications.create({
      data: {
        recipient_id: res.member_id,
        recipient_type: "MEMBER",
        category: "ATTENDANCE",
        type: "MEMBER_CHECK_OUT",
        title: "Checked Out",
        description: `You checked out successfully at ${formattedTime} (${sessionType.toLowerCase()} session).`,
      },
    });

    return {
      success: true,
      message: `${sessionType} checkout successful.`,
      attendance_id: res.id,
      sessionType,
      checkout_time: res[checkoutField],
    };
  });

  getIO().to("members-room").emit("attendance:checkout", {
    attendance_id,
    sessionType,
  });

  return result;
};