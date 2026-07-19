import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/features/settings/sections/membership_plans/api/plan.api";
import type { CreatePlanDTO, UpdatePlanDTO } from "../types/plans.types";

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: api.getPlansApi,
  });
}

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlanDTO) => api.createPlanApi(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["plans"],
      });
    },
  });
}

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ data }: { data: UpdatePlanDTO[] }) =>
      api.updatePlanApi(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["plans"]
      });

    },
  });
}

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.deletePlanApi(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["plans"],
      });
    },
  });
}