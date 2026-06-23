import { Request, Response } from "express";
import { checkInService } from "./checkin.service";

export const checkInController = async (req: Request, res: Response) => {
  try {
    const memberId = 1;//req.user?.id! ?? 1; // from auth middleware
    const { sessionId } = req.body;

    const result = await checkInService(memberId, sessionId);

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(error.status || 500).json({
      message: error.message || "Server error"
    });
  }
};