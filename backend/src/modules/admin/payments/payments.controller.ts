import { Request, Response } from "express";
import * as service from "./payments.service";

export const getSummaryDataController = async (req: Request, res: Response) => {
  try {
    const result = await service.getSummaryDataService();

    return res.status(201).json(result);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch summary data" });
  }
};

export const createPaymentController = async (req: Request, res: Response) => {
  try {
    const payment = await service.createPaymentService(req.body);

    return res.status(201).json({
      message: "Payment recorded successfully",
      data: payment,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to create payment" });
  }
};

export const getPaymentsController = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;

    const payments = await service.getPaymentsService({
      status: status as any,
      search: search as string,
    });

    return res.json(payments);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch payments" });
  }
};

export const getUnpaidMembersController = async (req: Request, res: Response) => {
  try {
    const members = await service.getUnpaidMembersService();

    return res.json(members);
  } catch (err: any) {
    return res.status(500).json({
      message: err.message || "Failed to fetch unpaid members",
    });
  }
};