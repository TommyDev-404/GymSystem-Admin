import { Request, Response } from "express";
import { getAttendanceService } from "./attendance.service";

export const getAttendanceController = async (req: Request, res: Response) => {
  try {
    const { year, month, day } = req.query;

    const data = await getAttendanceService({
      year: year ? Number(year) : undefined,
      month: month ? Number(month) : undefined,
      day: day ? Number(day) : undefined
    });

    return res.status(200).json(data);
  } catch (error: any) {
    return res.status(error.status || 500).json({
      message: error.message || "Server error"
    });
  }
};