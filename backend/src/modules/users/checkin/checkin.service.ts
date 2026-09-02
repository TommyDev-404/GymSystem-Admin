import { prisma } from "../../../lib/prisma";
import { getIO } from "../../../lib/socket";

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

export const checkInService = async (memberId: number, sessionId: string) => {

	if (!sessionId) {
		return { status: 400, message: "sessionId is required" };
	}

	const session = await prisma.checkin_sessions.findUnique({
		where: {
			id: sessionId
		}
	});

	if (!session) {
		return { status: 404, message: "Invalid QR code" };
	}

	if (session.expires_at < new Date()) {
		return { status: 400, message: "QR code expired" };
	}

	const existing = await prisma.attendance.findFirst({
		where: {
			member_id: memberId,
			session_id: sessionId
		}
	});

	if (existing) {
		return { status: 400, message: "Already checked in" };
	}

	const member = await prisma.members.findUnique({
		where: {
			id: memberId
		},
		select: {
			fullname: true,
			points: true
		}
	});

	if (!member) {
		return {status: 404, message: "Member not found"};
	}

	const result = await prisma.$transaction(async (tx) => {

		// 1. Create attendance
		const attendance = await tx.attendance.create({
			data: {
				member_id: memberId,
				session_id: sessionId
			}
		});

		// 2. Update member points
		const updatedMember = await tx.members.update({
			where: {
				id: memberId
			},
			data: {
				points: {
					increment: 10
				}
			}
		});

		// 3. Admin activity
		await tx.activities.create({
			data: {
				category: "ATTENDANCE",
				recipient_type: "ADMIN",
				title: "Member Check-in",
				description: `${member.fullname} checked in`,
				recipient_id: memberId
			}
		});

		// 4. Member activity
		await tx.activities.create({
			data: {
				category: "ATTENDANCE",
				recipient_type: "MEMBER",
				title: "Checked in",
				description: "You successfully checked in",
				recipient_id: memberId
			}
		});

		// 5. Notification
		await tx.notifications.create({
			data: {
				recipient_id: memberId,
				recipient_type: "MEMBER",
				category: "ATTENDANCE",
				type: "ATTENDANCE_POINTS",
				title: "You earned points!",
				description: "Check-in complete! +10 points earned."
			}
		});
		
		return {
			success: true,
			message: "Check-in successful"
		};
	});

	// Socket events
	getIO()
	.to("admin-room")
	.emit("attendance:new", { memberId });
	
	return result;
};