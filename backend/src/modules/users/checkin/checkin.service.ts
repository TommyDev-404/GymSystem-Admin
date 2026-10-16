import { prisma } from "../../../lib/prisma.js";
import { getIO } from "../../../lib/socket.js";
import { getEngagementStatus } from "../../../utils/engagementStatus.js";

export const getMemberWeeklyAttendanceService = async (memberId: number) => {
	const now = new Date();

	const day = now.getDay();

	// Convert Sunday = 0 into Monday-based week
	const mondayOffset = day === 0 ? -6 : 1 - day;

	const startOfWeek = new Date(now);
	startOfWeek.setDate(now.getDate() + mondayOffset);
	startOfWeek.setHours(0, 0, 0, 0);

	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 7);

	const attendance = await prisma.attendance.findMany({
		where: {
			member_id: memberId,
			check_in_time: {
				gte: startOfWeek,
				lt: endOfWeek,
			},
		},
		select: {
			check_in_time: true,
			checkout_time: true
		},
		orderBy: {
			check_in_time: "asc",
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

	return days.map(({ day, label }) => ({
		value: attendance.filter(
			(item) => item.check_in_time.getDay() === day
		).length,
		label,
	}));
};

export const checkInService = async (
  memberId: number,
  sessionId: string,
) => {
  if (!sessionId) {
    return {
      status: 400,
      message: "sessionId is required",
    };
  }

  const session = await prisma.checkin_sessions.findUnique({
    where: {
      id: sessionId,
    },
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
    where: {
      id: memberId,
    },
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

  const existing = await prisma.attendance.findFirst({
    where: {
      member_id: memberId,
      session_id: sessionId,
    },
  });

  if (existing) {
    return {
      status: 400,
      message: "Already checked in",
    };
  }

  // Determine engagement status before recording this check-in.
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

  const previousEngagementStatus = getEngagementStatus(
    lastAttendance?.check_in_time ?? null,
  );

  const wasInactive = previousEngagementStatus === "INACTIVE";

	// check for perfect attendance
  const attendanceCount = await prisma.attendance.count({
		where: {
		member_id: memberId,
		},
	});
	
	const isPerfectAttendanceBonus = (attendanceCount + 1) % 7 === 0;
	
	const pointsToAward = isPerfectAttendanceBonus ? 10 : 5; // increase points if perfect attendance
	
  const result = await prisma.$transaction(async (tx) => {
    // 1. Create attendance.
    await tx.attendance.create({
      data: {
        member_id: memberId,
        session_id: sessionId,
      },
    });

    // 2. Award attendance points.
    await tx.members.update({
		where: {
		  id: memberId,
		},
		data: {
		  points: {
			 increment: pointsToAward,
		  },
		},
	 });

    // 3. Create admin activity.
    await tx.activities.create({
      data: {
        category: "ATTENDANCE",
        recipient_type: "ADMIN",
        title: "Member Check-in",
        description: `${member.fullname} checked in`,
        recipient_id: memberId,
      },
    });

    // 4. Create member attendance activity.
    await tx.activities.create({
      data: {
        category: "ATTENDANCE",
        recipient_type: "MEMBER",
        title: "Checked in",
        description: "You successfully checked in",
        recipient_id: memberId,
      },
    });

    // 5. Notify the member about earned points.
    await tx.notifications.create({
      data: {
        recipient_id: memberId,
        recipient_type: "MEMBER",
        category: "ATTENDANCE",
        type: "ATTENDANCE_POINTS",
        title: "You earned points!",
        description: "Check-in complete! +5 points earned.",
      },
    });

    // 6. Welcome back inactive members.
    if (wasInactive) {
      await tx.activities.create({
        data: {
          category: "ATTENDANCE",
          recipient_type: "MEMBER",
          title: "Welcome Back!",
          description:
            "Welcome back to the gym! Your engagement status is now active. Keep up your fitness journey!",
          recipient_id: memberId,
        },
      });

      await tx.notifications.create({
        data: {
          recipient_id: memberId,
          recipient_type: "MEMBER",
          category: "ATTENDANCE",
          type: "ACCOUNT_REACTIVATED",
          title: "Welcome Back!",
          description: "Great to see you again! Your engagement status is now Active. Keep showing up and working toward your fitness goals!"
        },
      });
    }

    return {
      success: true,
      previousEngagementStatus,
      engagementStatus: "ACTIVE",
      welcomedBack: wasInactive,
    };
  });

  // 7. Notify the admin dashboard through Socket.IO.
  getIO()
    .to("admin-room")
    .emit("attendance:new", {
      memberId,
      reactivated: wasInactive,
      previousEngagementStatus,
      engagementStatus: result.engagementStatus,
    });

  return {
    status: 200,
    ...result,
    message: wasInactive
      ? "Welcome back! Your engagement status is now active."
      : "Check-in successful",
  };
};