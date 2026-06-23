import { Request, Response } from "express";
import { PaymentService } from "./payments.service";

export const PaymentController = {
  // ➕ CREATE PAYMENT
  createPayment: async (req: Request, res: Response) => {
    try {
      const payment = await PaymentService.createPayment(req.body);

      return res.status(201).json({
        message: "Payment recorded successfully",
        data: payment,
      });
    } catch (err) {
      return res.status(500).json({ message: "Failed to create payment" });
    }
  },

  // 🔎 GET PAYMENTS (FILTER + SEARCH)
  getPayments: async (req: Request, res: Response) => {
    console.log(req.query);
    try {
      const { status, search } = req.query;

      const payments = await PaymentService.getPayments({
        status: status as any,
        search: search as string,
      });
      console.log(payments);

      return res.json(payments);
    } catch (err) {
      return res.status(500).json({ message: "Failed to fetch payments" });
    }
  },

  getUnpaidMembers: async (req: Request, res: Response) => {
    try {
      const members = await PaymentService.getUnpaidMembers();

      return res.json(members);
    } catch (err: any) {
      return res.status(500).json({
        message: err.message || "Failed to fetch unpaid members",
      });
    }
  },
};