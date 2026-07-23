import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/rewards.api"
import type { Rewards } from "../types/RewardsType";

export function useGetAllRewards() {
   return useQuery({
     queryKey: ["rewards"],
     queryFn: api.getRewardsApi,
   });
}

export function useGetMemberProgress() {
   return useQuery({
     queryKey: ["rewards-member-progress"],
     queryFn: api.getMembersProgressApi,
   });
}

export function useGetSummaryData() {
   return useQuery({
     queryKey: ["rewards-summary-data"],
     queryFn: api.getSummaryDataApi,
   });
}
 
export function useCreateReward() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: (data: Omit<Rewards, "id">) => api.createRewardApi(data),
 
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['rewards'] });
       queryClient.invalidateQueries({ queryKey: ['rewards-summary-data'] });
     },
   });
}

export function useUpdateReward() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: ({ id, data }: { id: number, data: Partial<Rewards> }) => api.updateRewardApi(id, data),
 
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['rewards'] });
     },
   });
}

export function useDeleteReward() {
   const queryClient = useQueryClient();
 
   return useMutation({
     mutationFn: (id: number) => api.deleteRewardApi(id),
 
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['rewards'] });
       queryClient.invalidateQueries({ queryKey: ['rewards-summary-data'] });
     },
   });
}