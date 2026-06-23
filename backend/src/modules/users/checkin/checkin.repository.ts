import { prisma } from "../../../lib/prisma";

export const AttendanceRepository = {
  findSession: async (sessionId: string) => {
    return prisma.checkin_sessions.findUnique({
      where: { id: sessionId }
    });
  },

  findAttendance: async (memberId: number, sessionId: string) => {
    return prisma.attendance.findFirst({
      where: {
        member_id: memberId,
        session_id: sessionId
      }
    });
  },

  create: async (memberId: number, sessionId: string) => {
    return prisma.attendance.create({
      data: {
        member_id: memberId,
        session_id: sessionId,
        status: "PRESENT"
      }
    });
   }
};