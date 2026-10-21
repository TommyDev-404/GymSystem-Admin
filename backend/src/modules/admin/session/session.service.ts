import { randomUUID } from "crypto";
import { prisma } from "../../../lib/prisma.js";

const PHILIPPINE_UTC_OFFSET_MS = 8 * 60 * 60 * 1000;

const getPhilippineDayRange = () => {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = Number(parts.find((part) => part.type === "year")!.value);
  const month = Number(parts.find((part) => part.type === "month")!.value);
  const day = Number(parts.find((part) => part.type === "day")!.value);

  const start = new Date(
    Date.UTC(year, month - 1, day) - PHILIPPINE_UTC_OFFSET_MS,
  );

  const end = new Date(
    Date.UTC(year, month - 1, day + 1) -
      PHILIPPINE_UTC_OFFSET_MS -
      1,
  );

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
      created_at: new Date(),
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
    created_at: session.created_at,
    expires_at: session.expires_at,
  });
};