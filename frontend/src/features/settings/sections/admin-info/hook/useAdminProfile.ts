import { useMutation, useQuery } from "@tanstack/react-query";
import * as api from "@/features/settings/sections/admin-info/api/admin-info.api";
import type { UpdateAdminProfileDTO } from "../types/admin-info.types";


export function useGetAdminProfileInfo(adminId: number) {
  return useQuery({
    queryKey: ["admin-profile"],
    queryFn: () => api.getAdminProfileApi(adminId),
  });
}

export function useUpdateAdminProfileInfo() {
  return useMutation({
    mutationFn: ({ adminId, data }: { adminId: number; data: UpdateAdminProfileDTO }) =>
      api.updateAdminProfileApi(adminId, data),
  });
}

export function useUpdateAdminPassword() {
  return useMutation({
    mutationFn: ({ adminId, newPassword }: { adminId: number; newPassword: string }) =>
      api.updateAdminPasswordApi(adminId, newPassword),
  });
}