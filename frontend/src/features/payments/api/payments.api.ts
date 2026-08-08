import { api } from "@/lib/axios";
import type { CreatePaymentDTO, PaymentFilters } from "../types/PaymentTypes";

export const createPaymentApi = async (data: CreatePaymentDTO) => {
  try {
    const res = await api.post("/payments/add", data);
    return res.data;
  } catch (error) {
    console.log("Error: ", error)
  }
};

export const getPaymentsApi = async (params?: PaymentFilters) => {
  try {
    const res = await api.get("/payments", { params });
    return res.data;
  } catch (error) {
    console.log("Error: ", error)
  }
};

export const getUnpaidMembersApi = async () => {
  try {
    const res = await api.get("/payments/unpaid-members");
    return res.data;
  } catch (error) {
    console.log("Error: ", error)
  }
};

export const getSummaryDataApi = async () => {
  try {
    const res = await api.get("/payments/summary");
    return res.data;
  } catch (error) {
    console.log("Error: ", error)
  }
};
