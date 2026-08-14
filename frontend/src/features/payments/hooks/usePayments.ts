import { useQuery } from "@tanstack/react-query";
import * as api from "@/features/payments/api/payments.api";
import type { Payment, PaymentFiltersType, PaymentSummary } from "../types/PaymentTypes";

export function usePaymentSummaryData() {
  return useQuery<PaymentSummary>({
    queryKey: ['payment-summary'],
    queryFn: api.getSummaryDataApi
  });
}

export function usePayments(params?: PaymentFiltersType) {
  return useQuery<Payment[]>({
    queryKey: ["payments", params],
    queryFn: () => api.getPaymentsApi(params),
  });
}