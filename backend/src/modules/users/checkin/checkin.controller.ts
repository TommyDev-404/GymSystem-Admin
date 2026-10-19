import { Request, Response } from "express";
import * as service from "./checkin.service.js";

export const getMemberWeeklyAttendanceController = async (req: Request, res: Response) => {
  try {
    const memberId = Number(req.params.member_id);

    const result = await service.getMemberWeeklyAttendanceService(memberId);
    
    return res.status(200).json(result);
  } catch (error: any) {
    console.log(error);

    return res.status(error.status || 500).json({
      message: error.message || "Server error"
    });
  }
};

type SessionType = "MORNING" | "AFTERNOON";
type AttendanceAction = "CHECK_IN" | "CHECK_OUT";

export const checkInController = async (
  req: Request,
  res: Response,
) => {
  try {
    const memberId = Number(req.params.member_id);
    const { sessionId, sessionType, action } = req.body ?? {};

    if (!Number.isInteger(memberId) || memberId <= 0) {
      return res.status(400).json({
        message: "Invalid member ID",
      });
    }

    if (typeof sessionId !== "string" || !sessionId.trim()) {
      return res.status(400).json({
        message: "sessionId is required",
      });
    }

    if (
      sessionType !== "MORNING" &&
      sessionType !== "AFTERNOON"
    ) {
      return res.status(400).json({
        message: "sessionType must be MORNING or AFTERNOON",
      });
    }

    if (
      action !== "CHECK_IN" &&
      action !== "CHECK_OUT"
    ) {
      return res.status(400).json({
        message: "action must be CHECK_IN or CHECK_OUT",
      });
    }

    const result = await service.checkInService({
      memberId,
      sessionId,
      sessionType: sessionType as SessionType,
      action: action as AttendanceAction,
    });

    return res.status(result.status ?? 200).json(result);
  } catch (error: any) {
    console.error("Check-in controller error:", error);

    return res.status(error.status || 500).json({
      message: error.message || "Server error",
    });
  }
};

