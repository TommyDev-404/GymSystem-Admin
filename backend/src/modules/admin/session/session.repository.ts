import { prisma } from "../../../lib/prisma";
import { randomUUID } from "crypto";

export const SessionRepository = {
  create: async (expires_at: Date) => {
    const sessionId = randomUUID();

    return prisma.checkin_sessions.create({
      data: {
        id: sessionId,
        expires_at
      }
    });
  },
  
  getTodaySession: async () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return prisma.checkin_sessions.findFirst({
      where: {
        created_at: {
          gte: start,
          lte: end
        }
      }
    });
  }
};
