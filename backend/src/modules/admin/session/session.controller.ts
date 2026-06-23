import {
   createDailySessionService,
   getTodayQrService
} from "./session.service";
import { Request, Response } from "express";

export const createSessionController = async (req: Request, res: Response) => {
  try {
    const session = await createDailySessionService();

    return res.status(201).json(session);
  } catch (error: unknown) {
    const err = error as { status?: number; message?: string };

    return res.status(err.status || 500).json({
      message: err.message || "Server error"
    });
  }
};

export const getTodayQrController = async (req: Request, res: Response) => {
   try {
     const qr = await getTodayQrService();
 
     return res.status(200).json({ qr });
   } catch (error: unknown) {
     const err = error as { status?: number; message?: string };
 
     return res.status(err.status || 500).json({
       message: err.message || "Server error"
     });
   }
 };