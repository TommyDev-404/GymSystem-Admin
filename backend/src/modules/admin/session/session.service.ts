import { randomUUID } from "crypto";
import { prisma } from "../../../lib/prisma.js";

const getPhilippineDayRange = () => {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const values = Object.fromEntries(
    parts.map(({ type, value }) => [type, value]),
  );

  const year = Number(values.year);
  const month = Number(values.month);
  const day = Number(values.day);

  const start = new Date(
    Date.UTC(year, month - 1, day, -8),
  );

  const nextDayStart = new Date(
    Date.UTC(year, month - 1, day + 1, -8),
  );

  return {
    start,
    end: new Date(nextDayStart.getTime() - 1),
  };
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

  const created_at = new Date();

  return prisma.checkin_sessions.create({
    data: {
      id: randomUUID(),
      created_at,
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