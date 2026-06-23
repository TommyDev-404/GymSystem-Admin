import { AttendanceRepository } from "./checkin.repository";

export const checkInService = async (memberId: number, sessionId: string) => {
  if (!sessionId) {
    throw { status: 400, message: "sessionId is required" };
  }

  // 1. validate session
  const session = await AttendanceRepository.findSession(sessionId);

  if (!session) {
    throw { status: 404, message: "Invalid QR code" };
  }

  // 2. check expiry
  if (session.expires_at < new Date()) {
    throw { status: 400, message: "QR code expired" };
  }
   
  // 3. prevent duplicate scan
  const existing = await AttendanceRepository.findAttendance(memberId, sessionId);

  if (existing) {
    throw { status: 400, message: "Already checked in" };
  }

  // 4. create attendance
  const attendance = await AttendanceRepository.create(memberId, sessionId);

  return {
    message: "Check-in successful",
    attendance
  };
};