import { api } from "@/lib/axios";
import type { CreatePaymentDTO, PaymentFilters } from "../types/payment";

export const createPaymentApi = async (data: CreatePaymentDTO) => {
  const res = await api.post("/payments/add", data);
  return res.data;
};

export const getPaymentsApi = async (params?: PaymentFilters) => {
  const res = await api.get("/payments", {
    params,
  });

  return res.data;
};

export const getUnpaidMembersApi = async () => {
  const res = await api.get("/payments/unpaid-members");
  return res.data;
};

export const getSummaryDataApi = async () => {
  const res = await api.get("/payments/summary");
  return res.data;
};
