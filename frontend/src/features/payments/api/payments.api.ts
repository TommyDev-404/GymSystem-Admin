import { api } from "@/lib/axios";
import type { PaymentFiltersType } from "../types/PaymentTypes";

export const getPaymentsApi = async (params?: PaymentFiltersType) => {
  try {
    const res = await api.get("/payments", { params });
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

