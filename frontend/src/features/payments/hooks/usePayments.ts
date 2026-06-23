import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getPaymentsApi,
  createPaymentApi,
  getPaymentByIdApi,
  type PaymentFilters,
  type CreatePaymentDTO,
  getUnpaidMembersApi,
} from "@/features/payments/api/payments.api";

/* ---------------- QUERY KEYS ---------------- */

const paymentKeys = {
   all: ["payments"] as const,
   list: () => [...paymentKeys.all, "list"] as const,
   detail: (id: number) => [...paymentKeys.all, "detail", id] as const,
   unpaidMembers: () => [...paymentKeys.all, "unpaid-members"] as const,
};

/* ---------------- GET ALL PAYMENTS ---------------- */

export function usePayments(params?: PaymentFilters) {
  return useQuery({
    queryKey: ["payments", params],
    queryFn: () => getPaymentsApi(params),
  });
}

/* ---------------- GET SINGLE PAYMENT ---------------- */

export function usePayment(id: number) {
  return useQuery({
    queryKey: paymentKeys.detail(id),
    queryFn: () => getPaymentByIdApi(id),
    enabled: !!id,
  });
}

/* ---------------- CREATE PAYMENT ---------------- */

export function useCreatePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePaymentDTO) =>
      createPaymentApi(data),

    onSuccess: () => {
      // refresh payments list
      queryClient.invalidateQueries({
        queryKey: paymentKeys.all,
      });
    },
  });
}

export type UnpaidMember = {
  id: number;
  name: string;
};

export function useUnpaidMembers() {
  return useQuery<UnpaidMember[]>({
    queryKey: paymentKeys.unpaidMembers(),
    queryFn: getUnpaidMembersApi,
    staleTime: 1000 * 60 * 5, // cache for 5 mins
  });
}