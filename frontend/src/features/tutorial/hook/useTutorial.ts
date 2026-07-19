import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/tutorial.api"
import type { TutorialsFilters } from "../types/TutorialType";

export function useGetAllTutorials(params?: TutorialsFilters) {
   return useQuery({
     queryKey: ['tutorial', params],
     queryFn: () => api.getAllTutorialsApi(params),
   });
 }

export function useCreateTutorial() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: (data: FormData) => api.createTutorialApi(data),
 
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['tutorial'] });
     },
   });
}

export function useUpdateTutorial() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: ({ id, data } : { id: number, data: FormData}) => api.updateTutorialApi(id, data),
 
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['tutorial'] });
     },
   });
}
 
export function useRemoveTutorial() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: (id : number) => api.removeTutorialApi(id),
 
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['tutorial'] });
     },
   });
 }