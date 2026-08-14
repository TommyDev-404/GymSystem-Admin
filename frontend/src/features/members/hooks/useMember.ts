import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/features/members/api/members.api";
import type { AddMemberFormType, MemberFilters, MemberSummaryType, RenewMembershipDTO, UpgradeMembership } from "../types/member";

export function useMembersSummary() {
  return useQuery<MemberSummaryType>({
    queryKey: ["members-summary"],
    queryFn: api.getMembersSummaryApi,
  });
}

export function useMembers(params?: MemberFilters) {
   return useQuery({
     queryKey: ["members", params],
     queryFn: () => api.getMembersApi(params),
   });
 }

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AddMemberFormType) => api.createMemberApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });
      
      queryClient.invalidateQueries({
        queryKey: ["members-summary"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-recent-activity"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary-data"],
      });

      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
      
      queryClient.invalidateQueries({
        queryKey: ["payments-summary"],
      });
    },
  });
}

export function useUpgradeMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: UpgradeMembership
    }) => api.upgradeMembershipPlanApi(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members"]
      });

      queryClient.invalidateQueries({
        queryKey: ["members-summary"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-recent-activity"],
      });
      
      queryClient.invalidateQueries({
        queryKey: ["payments"],
      });
      
      queryClient.invalidateQueries({
        queryKey: ["payments-summary"],
      });
    },
  });
}

export function useResendActivationCode() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      email,
    }: {
      email: string;
    }) => api.resendActivationCodeApi(email),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });
    },
  });
}

export function useRenewMembership() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RenewMembershipDTO) => api.renewMembershipApi(data),
    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey:["members"],
      });
    
      queryClient.invalidateQueries({
        queryKey: ["members-summary"],
      });

      queryClient.invalidateQueries({
        queryKey:["payments"],
      });
      
      queryClient.invalidateQueries({
        queryKey: ["payments-summary"],
      });
    },
  });
}