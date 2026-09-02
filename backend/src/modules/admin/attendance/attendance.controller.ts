import { Request, Response } from "express";
import * as service from "./attendance.service";

export const getAttendanceController = async (req: Request, res: Response) => {
  try {
    const { year, month, day } = req.query;

    const data = await service.getAttendanceService({
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

export const markCheckoutController = async (req: Request, res: Response) => {
  console.log("Reach here: ", req.params.attendance_id)
  try {
    const result = await service.markCheckoutService(Number(req.params.attendance_id));
    console.log(result);
    return res.status(200).json(result);
  } catch (error: any) {
    console.log(error);
    return res.status(error.status || 500).json({
      message: error.message || "Server error"
    });
  }
};