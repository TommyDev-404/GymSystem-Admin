import { Request, Response } from "express";
import * as service from "./attendance.service.js";

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

export const markCheckoutController = async (
  req: Request,
  res: Response,
) => {
  try {
    const attendance_id = Number(req.params.attendance_id);
    const { sessionType } = req.body as {
      sessionType?: "MORNING" | "AFTERNOON";
    };

    if (!Number.isInteger(attendance_id) || attendance_id <= 0) {
      return res.status(400).json({
        message: "Invalid attendance ID",
      });
    }

    if (sessionType !== "MORNING" && sessionType !== "AFTERNOON") {
      return res.status(400).json({
        message: "sessionType must be MORNING or AFTERNOON",
      });
    }

    const result = await service.markCheckoutService(
      attendance_id,
      sessionType,
    );

    return res.status(200).json(result);
  } catch (error: any) {
    console.error(error);

    return res.status(error.status || 500).json({
      message: error.message || "Server error",
    });
  }
};