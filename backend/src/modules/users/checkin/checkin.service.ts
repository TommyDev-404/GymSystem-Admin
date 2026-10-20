import { prisma } from "../../../lib/prisma.js";
import { getIO } from "../../../lib/socket.js";
import { getEngagementStatus } from "../../../utils/engagementStatus.js";


type SessionType = "MORNING" | "AFTERNOON";

type AttendanceAction = "CHECK_IN" | "CHECK_OUT";

type CheckInOptions = {
  memberId: number;
  sessionId: string;
  sessionType: SessionType;
  action: AttendanceAction;
};

export const checkInService = async ({
  memberId,
  sessionId,
  sessionType,
  action,
}: CheckInOptions) => {
  if (!sessionId) {
    return {
      status: 400,
      message: "sessionId is required",
    };
  }

  if (!["MORNING", "AFTERNOON"].includes(sessionType)) {
    return {
      status: 400,
      message: "Invalid session type",
    };
  }

  if (!["CHECK_IN", "CHECK_OUT"].includes(action)) {
    return {
      status: 400,
      message: "Invalid attendance action",
    };
  }

  const session = await prisma.checkin_sessions.findUnique({
    where: { id: sessionId },
  });

  if (!session) {
    return {
      status: 404,
      message: "Invalid QR code",
    };
  }

  const now = new Date();

  if (session.expires_at.getTime() <= now.getTime()) {
    return {
      status: 400,
      message: "QR code expired",
    };
  }

  const member = await prisma.members.findUnique({
    where: { id: memberId },
    select: {
      fullname: true,
      points: true,
    },
  });

  if (!member) {
    return {
      status: 404,
      message: "Member not found",
    };
  }

  const existing = await prisma.attendance.findUnique({
    where: {
      member_id_session_id: {
        member_id: memberId,
        session_id: sessionId,
      },
    },
  });

  const checkInField =
    sessionType === "MORNING"
      ? "morning_checkin_time"
      : "afternoon_checkin_time";

  const checkOutField =
    sessionType === "MORNING"
      ? "morning_checkout_time"
      : "afternoon_checkout_time";

  if (action === "CHECK_IN" && existing?.[checkInField]) {
    return {
      status: 400,
      message: `Already checked in for the ${sessionType.toLowerCase()} session`,
    };
  }

  if (action === "CHECK_OUT" && !existing) {
    return {
      status: 400,
      message: "No attendance record found",
    };
  }

  if (action === "CHECK_OUT" && !existing?.[checkInField]) {
    return {
      status: 400,
      message: `You must check in for the ${sessionType.toLowerCase()} session first`,
    };
  }

  if (action === "CHECK_OUT" && existing?.[checkOutField]) {
    return {
      status: 400,
      message: `Already checked out for the ${sessionType.toLowerCase()} session`,
    };
  }

  const lastAttendance = await prisma.attendance.findMany({
    where: {
      member_id: memberId,
    },
    select: {
      morning_checkin_time: true,
      afternoon_checkin_time: true,
    },
  });

  const lastCheckInTime =
    lastAttendance
      .flatMap((attendance) => [
        attendance.morning_checkin_time,
        attendance.afternoon_checkin_time,
      ])
      .filter((date): date is Date => date !== null)
      .sort((a, b) => b.getTime() - a.getTime())[0] ?? null;

  const previousEngagementStatus = getEngagementStatus(lastCheckInTime);

  const wasInactive =
    previousEngagementStatus === "INACTIVE" ||
    previousEngagementStatus === "AT_RISK";

  let pointsToAward = 0;
  let isPerfectAttendanceBonus = false;
  let alreadyEarnedPointsToday = false;

  if (action === "CHECK_IN") {
    const attendanceRecords = await prisma.attendance.findMany({
      where: {
        member_id: memberId,
      },
      select: {
        morning_checkin_time: true,
        afternoon_checkin_time: true,
      },
    });

    const attendanceDays = new Set(
      attendanceRecords
        .flatMap((attendance) => [
          attendance.morning_checkin_time,
          attendance.afternoon_checkin_time,
        ])
        .filter((date): date is Date => date !== null)
        .map((date) =>
          new Intl.DateTimeFormat("en-CA", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
          }).format(date),
        ),
    );

    const today = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Manila",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(now);

    alreadyEarnedPointsToday = attendanceDays.has(today);

    if (!alreadyEarnedPointsToday) {
      isPerfectAttendanceBonus =
        (attendanceDays.size + 1) % 7 === 0;

      pointsToAward = isPerfectAttendanceBonus ? 10 : 5;
    }
  }

  const attendanceData = {
    ...(action === "CHECK_IN" && sessionType === "MORNING"
      ? { morning_checkin_time: now }
      : {}),
    ...(action === "CHECK_IN" && sessionType === "AFTERNOON"
      ? { afternoon_checkin_time: now }
      : {}),
    ...(action === "CHECK_OUT" && sessionType === "MORNING"
      ? { morning_checkout_time: now }
      : {}),
    ...(action === "CHECK_OUT" && sessionType === "AFTERNOON"
      ? { afternoon_checkout_time: now }
      : {}),
  };

  const result = await prisma.$transaction(async (tx) => {
    const attendance = await tx.attendance.upsert({
      where: {
        member_id_session_id: {
          member_id: memberId,
          session_id: sessionId,
        },
      },
      create: {
        member_id: memberId,
        session_id: sessionId,
        ...attendanceData,
      },
      update: attendanceData,
    });

    if (action === "CHECK_IN") {
      if (pointsToAward > 0) {
        await tx.members.update({
          where: { id: memberId },
          data: {
            points: {
              increment: pointsToAward,
            },
          },
        });

        await tx.notifications.create({
          data: {
            recipient_id: memberId,
            recipient_type: "MEMBER",
            category: "ATTENDANCE",
            type: "ATTENDANCE_POINTS",
            title: isPerfectAttendanceBonus
              ? "Perfect Attendance Bonus!"
              : "You earned points!",
            description: isPerfectAttendanceBonus
              ? `Check-in complete! +${pointsToAward} points earned for your 7th attendance day.`
              : `Check-in complete! +${pointsToAward} points earned.`,
          },
        });
      } else {
        await tx.notifications.create({
          data: {
            recipient_id: memberId,
            recipient_type: "MEMBER",
            category: "ATTENDANCE",
            type: "ATTENDANCE_POINTS",
            title: "Check-in complete!",
            description:
              "You've already claimed your attendance points for today. Your check-in has been recorded!",
          },
        });
      }

      await tx.activities.createMany({
        data: [
          {
            category: "ATTENDANCE",
            recipient_type: "ADMIN",
            title: "Member Check-in",
            description: `${member.fullname} checked in for the ${sessionType.toLowerCase()} session`,
            recipient_id: memberId,
          },
          {
            category: "ATTENDANCE",
            recipient_type: "MEMBER",
            title: "Checked in",
            description: `You successfully checked in for the ${sessionType.toLowerCase()} session`,
            recipient_id: memberId,
          },
        ],
      });

      if (wasInactive) {
        await tx.notifications.create({
          data: {
            recipient_id: memberId,
            recipient_type: "MEMBER",
            category: "ATTENDANCE",
            type: "ACCOUNT_REACTIVATED",
            title: "Welcome Back!",
            description:
              "Great to see you again! Your engagement status is now Active. Keep showing up and working toward your fitness goals!",
          },
        });

        await tx.notifications.create({
          data: {
            recipient_type: "ADMIN",
            category: "ATTENDANCE",
            type: "ACCOUNT_REACTIVATED",
            title: "Member Reactivated",
            description: `${member.fullname} has returned to the gym and their engagement status is now Active.`,
          },
        });
      }
    } else {
      await tx.activities.create({
        data: {
          category: "ATTENDANCE",
          recipient_type: "MEMBER",
          title: "Checked out",
          description: `You successfully checked out from the ${sessionType.toLowerCase()} session`,
          recipient_id: memberId,
        },
      });
    }

    return {
      attendance,
      previousEngagementStatus,
      engagementStatus:
        action === "CHECK_IN"
          ? "ACTIVE"
          : previousEngagementStatus,
      welcomedBack: action === "CHECK_IN" && wasInactive,
      pointsAwarded: pointsToAward,
      perfectAttendanceBonus: isPerfectAttendanceBonus,
      alreadyEarnedPointsToday:
        action === "CHECK_IN" && alreadyEarnedPointsToday,
    };
  });

  getIO().to("admin-room").emit("attendance:new", {
    memberId,
    action,
    sessionType,
    reactivated: result.welcomedBack,
    previousEngagementStatus,
    engagementStatus: result.engagementStatus,
  });

  return {
    status: 200,
    success: true,
    ...result,
    message:
      action === "CHECK_OUT"
        ? `${sessionType} check-out successful`
        : result.welcomedBack
          ? "Welcome back! Your engagement status is now active."
          : result.alreadyEarnedPointsToday
            ? `${sessionType} check-in successful. You have already earned your attendance points today.`
            : `${sessionType} check-in successful. You earned ${pointsToAward} points.`,
  };
};

export const getMemberWeeklyAttendanceService = async (
  memberId: number,
) => {
  const now = new Date();

  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;

  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() + mondayOffset);
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const attendance = await prisma.attendance.findMany({
    where: {
      member_id: memberId,
      OR: [
        {
          morning_checkin_time: {
            gte: startOfWeek,
            lt: endOfWeek,
          },
        },
        {
          afternoon_checkin_time: {
            gte: startOfWeek,
            lt: endOfWeek,
          },
        },
      ],
    },
    select: {
      morning_checkin_time: true,
      afternoon_checkin_time: true,
    },
  });

  const days = [
    { day: 1, label: "Mon" },
    { day: 2, label: "Tue" },
    { day: 3, label: "Wed" },
    { day: 4, label: "Thu" },
    { day: 5, label: "Fri" },
    { day: 6, label: "Sat" },
    { day: 0, label: "Sun" },
  ];

  return days.map(({ day, label }) => {
    const value = attendance.filter((item) => {
      const checkInTimes = [
        item.morning_checkin_time,
        item.afternoon_checkin_time,
      ];

      return checkInTimes.some(
        (time) => time !== null && time.getDay() === day,
      );
    }).length;

    return {
      value,
      label,
    };
  });
};
