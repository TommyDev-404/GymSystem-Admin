import { Request, Response } from "express";
import * as service from "./checkin.service";

export const checkInController = async (req: Request, res: Response) => {
  try {
    const memberId = Number(req.params.id);
    const { sessionId } = req.body;
    console.log(memberId);

    const result = await service.checkInService(memberId, sessionId);
    
    return res.status(200).json(result);
  } catch (error: any) {
    console.log(error);
    return res.status(error.status || 500).json({
      message: error.message || "Server error"
    });
  }
};

