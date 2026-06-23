import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getMembersApi,
  getMemberByIdApi,
  createMemberApi,
  updateMemberApi,
  deleteMemberApi,
  type Member,
  resendActivationCodeApi,
} from "@/features/members/api/members.api";

/* ---------------- QUERY KEYS ---------------- */

const memberKeys = {
  all: ["members"] as const,
  list: () => [...memberKeys.all, "list"] as const,
  detail: (id: number) => [...memberKeys.all, "detail", id] as const,
};

/* ---------------- GET ALL MEMBERS ---------------- */
type MemberFilters = {
  search?: string;
  gender?: string;
  status?: string;
};

export function useMembers(params?: MemberFilters) {
   return useQuery({
     queryKey: ["members", params],
     queryFn: () => getMembersApi(params),
   });
 }

/* ---------------- GET SINGLE MEMBER ---------------- */
export function useMember(id: number) {
  return useQuery({
    queryKey: memberKeys.detail(id),
    queryFn: () => getMemberByIdApi(id),
    enabled: !!id,
  });
}


/* ---------------- CREATE MEMBER ---------------- */

export function useCreateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Member, "id">) =>
      createMemberApi(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: memberKeys.all,
      });
    },
  });
}

/* ---------------- UPDATE MEMBER ---------------- */

export function useUpdateMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<Member>;
    }) => updateMemberApi(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: memberKeys.all,
      });
    },
  });
}

/* ---------------- DELETE MEMBER ---------------- */

export function useDeleteMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteMemberApi(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: memberKeys.all,
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
    }) => resendActivationCodeApi(email),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: memberKeys.all,
      });
    },
  });
}