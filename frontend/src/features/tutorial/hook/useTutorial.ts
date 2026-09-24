import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/tutorial.api";
import type { TutorialsFilters } from "../types/TutorialType";

export const tutorialKeys = {
  all: ["tutorial"] as const,
  lists: () => [...tutorialKeys.all, "list"] as const,
  list: (params?: TutorialsFilters) =>
    [...tutorialKeys.lists(), params] as const,
};

export function useGetAllTutorials(params?: TutorialsFilters) {
  return useQuery({
    queryKey: tutorialKeys.list(params),
    queryFn: () => api.getAllTutorialsApi(params),
  });
}

export function useCreateTutorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: FormData) => api.createTutorialApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tutorialKeys.lists(),
      });
    },
  });
}

export function useUpdateTutorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: FormData;
    }) => api.updateTutorialApi(id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: tutorialKeys.lists(),
      });
    },
  });
}

export function useRemoveTutorial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.removeTutorialApi(id),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: tutorialKeys.lists(),
      });
    },
  });
}