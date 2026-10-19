import { Request, Response } from "express";
import * as service from "./payments.service.js";

export const getPaymentsSummaryController = async (
  req: Request,
  res: Response
) => {
  try {
    const month = req.query.month
      ? Number(req.query.month)
      : undefined;

    const year = req.query.year
      ? Number(req.query.year)
      : undefined;

    const summary = await service.getPaymentSummaryService(month, year);

    return res.json(summary);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Failed to fetch payments summary",
    });
  }
};

export const getPaymentsController = async (req: Request, res: Response) => {
  try {
    const payments = await service.getPaymentsService(req.query);

    return res.json(payments);
  } catch (err) {
		console.log(err);
    return res.status(500).json({ message: "Failed to fetch payments" });
  }
};
