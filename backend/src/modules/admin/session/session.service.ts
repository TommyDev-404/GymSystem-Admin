
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

  // Philippine time is UTC+8.
  const start = new Date(
    Date.UTC(year, month - 1, day, -8, 0, 0, 0),
  );

  const end = new Date(
    Date.UTC(year, month - 1, day + 1, -8, 0, 0, 0) - 1,
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
      expires_at: end,
    },
  });
};

export const getTodayQrService = async () => {
  const session = await createDailySessionService();

  return JSON.stringify({
    session_id: session.id,
  });
};
