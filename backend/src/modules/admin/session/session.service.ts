import { randomUUID } from "crypto";
import { prisma } from "../../../lib/prisma.js";

const getPhilippineDayRange = () => {
  const now = new Date();

  const philippineDate = new Date(
    now.toLocaleString("en-US", {
      timeZone: "Asia/Manila",
    }),
  );

  const start = new Date(philippineDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(philippineDate);
  end.setHours(23, 59, 59, 999);

  return { start, end };
};

export const createDailySessionService = async () => {
  const { start, end } = getPhilippineDayRange();

  const existing = await prisma.checkin_sessions.findFirst({
    where: {
      created_at: {
        gte: start,
        lte: end,
      },
    },
  });

  if (existing) {
    return existing;
  }

  return prisma.checkin_sessions.create({
    data: {
      id: randomUUID(),
      created_at: start,
      expires_at: end,
    },
  });
};

export const getTodayQrService = async () => {
  const { start, end } = getPhilippineDayRange();

  const session = await prisma.checkin_sessions.findFirst({
    where: {
      created_at: {
        gte: start,
        lte: end,
      },
    },
  });

  if (!session) {
    throw {
      status: 404,
      message: "No session found",
    };
  }

  return JSON.stringify({
    session_id: session.id,
  });
};