import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@/features/members/api/members.api";
import type { Member, MemberFilters, RenewMembershipDTO } from "../types/member";

export function useMembers(params?: MemberFilters) {
   return useQuery({
     queryKey: ["members", params],
     queryFn: () => api.getMembersApi(params),
   });
 }

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Member, "id">) => api.createMemberApi(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-recent-activity"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary-data"],
      });

      queryClient.invalidateQueries({
        queryKey: ["payment-unpaid-members"],
      });
    },
  });
}

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Member>;
    }) => api.updateMemberApi(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members"]
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-gender-distribution"],
      });
      
      queryClient.invalidateQueries({
        queryKey: ["dashboard-recent-activity"],
      });

      queryClient.invalidateQueries({
        queryKey: ["payment-unpaid-members"],
      });
    },
  });
}

export function useUpdateMemberStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { status: string };
    }) => api.updateMemberStatusApi(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });
      
      queryClient.invalidateQueries({
        queryKey: ["dashboard-member-status"],
      });
    },
  });
}

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => api.deleteMemberApi(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:  ["members"]
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

    mutationFn: (
      data: RenewMembershipDTO
    ) =>
      api.renewMembershipApi(data),


    onSuccess: () => {

      queryClient.invalidateQueries({
        queryKey:["members"],
      });


      queryClient.invalidateQueries({
        queryKey:["payments"],
      });

    },

  });

}