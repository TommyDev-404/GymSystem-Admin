import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/features/payments/api/payments.api";
import type { CreatePaymentDTO, PaymentFilters, UnpaidMember } from "../types/payment";

export function usePayments(params?: PaymentFilters) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => api.getPaymentsApi(params),
  });
}

export function useUnpaidMembers() {
  return useQuery<UnpaidMember[]>({
    queryKey: ['payment-unpaid-members'],
    queryFn: api.getUnpaidMembersApi,
  });
}

export function usePaymentSummaryData() {
  return useQuery({
    queryKey: ['payment-summary-data'],
    queryFn: api.getSummaryDataApi
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentDTO) =>
      api.createPaymentApi(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['payments'],
      });

      queryClient.invalidateQueries({
        queryKey: ["payment-summary-data"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary-data"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-revenue-trend"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-recent-activity"],
      });
    },
  });
}
