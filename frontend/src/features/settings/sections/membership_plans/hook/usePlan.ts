import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  getPlansApi,
  createPlanApi,
  getPlanByIdApi,
  updatePlanApi,
  deletePlanApi,
  type CreatePlanDTO,
  type UpdatePlanDTO,
} from "@/features/settings/sections/membership_plans/api/plan.api";

/* ---------------- QUERY KEYS ---------------- */

const planKeys = {
  all: ["plans"] as const,
  list: () => [...planKeys.all, "list"] as const,
  detail: (id: number) => [...planKeys.all, "detail", id] as const,
};

/* ---------------- GET ALL PLANS ---------------- */

export function usePlans() {
  return useQuery({
    queryKey: planKeys.all,
    queryFn: getPlansApi,
  });
}

/* ---------------- GET SINGLE PLAN ---------------- */

export function usePlan(id: number) {
  return useQuery({
    queryKey: planKeys.detail(id),
    queryFn: () => getPlanByIdApi(id),
    enabled: !!id,
  });
}

/* ---------------- CREATE PLAN ---------------- */

export function useCreatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlanDTO) => createPlanApi(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: planKeys.all,
      });
    },
  });
}

/* ---------------- UPDATE PLAN ---------------- */

export function useUpdatePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePlanDTO }) =>
      updatePlanApi(id, data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: planKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: planKeys.detail(variables.id),
      });
    },
  });
}

/* ---------------- DELETE PLAN ---------------- */

export function useDeletePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePlanApi(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: planKeys.all,
      });
    },
  });
}