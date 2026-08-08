import { prisma } from "../../../lib/prisma";
import { getIO } from "../../../lib/socket";

export const checkInService = async (
  memberId: number,
  sessionId: string
) => {

  if (!sessionId) {
    throw { status: 400, message: "sessionId is required" };
  }

  const session = await prisma.checkin_sessions.findUnique({
    where: {
      id: sessionId
    }
  });

  if (!session) {
    throw { status: 404, message: "Invalid QR code" };
  }

  if (session.expires_at < new Date()) {
    throw { status: 400, message: "QR code expired" };
  }

  const existing = await prisma.attendance.findFirst({
    where: {
      member_id: memberId,
      session_id: sessionId
    }
  });

  if (existing) {
    throw { status: 400, message: "Already checked in" };
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
    throw {
      status: 404,
      message: "Member not found"
    };
  }

  const result = await prisma.$transaction(async (tx) => {

    // 1. Create attendance
    const attendance = await tx.attendance.create({
      data: {
        member_id: memberId,
        session_id: sessionId,
        status: "PRESENT"
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
        type: "CHECK_IN",
        recipient_type: "ADMIN",
        title: "Member Check-in",
        description: `${member.fullname} checked in`,
        recipient_id: memberId
      }
    });

    // 4. Member activity
    await tx.activities.create({
      data: {
        type: "CHECK_IN",
        recipient_type: "MEMBER",
        title: "Checked in",
        description: "You checked in today",
        recipient_id: memberId
      }
    });

    // 5. Notification
    await tx.notifications.create({
      data: {
        recipient_id: memberId,
        recipient_type: "MEMBER",
        type: "REWARD",
        title: "You earned points!",
        description: "Check-in complete! +10 points earned."
      }
    });

    return {
      attendance,
      updatedMember
    };

  });

  // Socket events
  getIO()
    .to("admin-room")
    .emit(
      "attendance:new",
      {
        memberId
      }
    );

  /*
  getIO()
    .to(`member-${memberId}`)
    .emit(
      "notification:new",
      {
        memberId
      }
    );
*/
  return {
    message: "Check-in successful",
    attendance: result.attendance
  };
};