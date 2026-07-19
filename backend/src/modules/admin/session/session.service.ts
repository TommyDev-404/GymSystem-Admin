import { randomUUID } from "crypto";
import { prisma } from "../../../lib/prisma";

export const createDailySessionService = async () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const existing = await prisma.checkin_sessions.findFirst({
    where: {
      created_at: {
        gte: start,
        lte: end
      }
    }
  });

  if (existing) {
    return existing;
  }
   
  const expires_at = new Date();
  expires_at.setHours(23, 59, 59, 999);

  const sessionId = randomUUID();

  return await prisma.checkin_sessions.create({
    data: {
      id: sessionId,
      expires_at
    }
  });
};

export const getTodayQrService = async () => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const session = await prisma.checkin_sessions.findFirst({
    where: {
      created_at: {
        gte: start,
        lte: end
      }
    }
  });

  if (!session) {
    throw { status: 404, message: "No session found" };
  }

  const payload = JSON.stringify({
    session_id: session.id
  });

  return payload;
};