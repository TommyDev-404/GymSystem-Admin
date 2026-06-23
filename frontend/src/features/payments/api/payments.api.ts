import { api } from "@/lib/axios";

/* ---------------- TYPES ---------------- */

export type Payment = {
  id: number;
  bill_id: number;
  amount_paid: number;
  paid_on: string;

  bill?: {
    id: number;
    member_id: number;
    amount_due: number;
    due_date: string;

    member?: {
      id: number;
      fullname: string;
      plan: string;
    };
  };
};

export type CreatePaymentDTO = {
  member_id: number; // admin selects member name
  amount_paid: number;
  paid_on: string;
};

/* ---------------- CREATE PAYMENT ---------------- */

export const createPaymentApi = async (data: CreatePaymentDTO) => {
  const res = await api.post("/payments/add", data);
  return res.data;
};

/* ---------------- GET ALL PAYMENTS (WITH FILTERS) ---------------- */

export type PaymentFilters = {
  search?: string;
  status?: "Paid" | "Pending" | "Overdue" | "All";
};

export const getPaymentsApi = async (params?: PaymentFilters) => {
  const res = await api.get("/payments", {
    params,
  });

  return res.data;
};

/* ---------------- GET PAYMENT BY ID ---------------- */

export const getPaymentByIdApi = async (id: number) => {
  const res = await api.get(`/payments/${id}`);
  return res.data;
};

/* ---------------- GET UNPAID MEMBERS (OPTIONAL BUT USEFUL) ---------------- */

export const getUnpaidMembersApi = async () => {
  const res = await api.get("/payments/unpaid-members");
  return res.data;
};