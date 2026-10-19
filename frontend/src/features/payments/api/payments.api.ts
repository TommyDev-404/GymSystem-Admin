import { api } from "@/lib/axios";
import type { PaymentFiltersType } from "../types/PaymentTypes";

export const getPaymentsApi = async (params?: PaymentFiltersType) => {
  try {
    const res = await api.get("/payments", { params });
    return res.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
};

export const getSummaryDataApi = async (
  month?: number,
  year?: number
) => {
  try {
    const res = await api.get("/payments/summary", {
      params: { month, year },
    });

    return res.data;
  } catch (error) {
    console.log("Error: ", error);
    throw error;
  }
};

