import { SessionRepository } from "./session.repository";

export const createDailySessionService = async () => {
  const existing = await SessionRepository.getTodaySession();

  if (existing) {
    return existing;
  }
   
  const expires_at = new Date();
  expires_at.setHours(23, 59, 59, 999);

  return SessionRepository.create(expires_at);
};

export const getTodayQrService = async () => {
  const session = await SessionRepository.getTodaySession();

  if (!session) {
    throw { status: 404, message: "No session found" };
  }

  const payload = JSON.stringify({
    session_id: session.id
  });

  return payload;
};