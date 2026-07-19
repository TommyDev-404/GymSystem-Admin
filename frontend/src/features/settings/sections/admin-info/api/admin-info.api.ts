import { api } from "@/lib/axios";
import type { UpdateAdminProfileDTO } from "../types/admin-info.types";

export const getAdminProfileApi = async (adminId: number) => {
   const res = await api.get(`/profile/${adminId}`);
   return res.data;
};

export const updateAdminProfileApi = async (adminId: number, data: UpdateAdminProfileDTO) => {
   const res = await api.patch(`/profile/update-info/${adminId}`, data);
   return res.data;
}

export const updateAdminPasswordApi = async (adminId: number, newPassword: string) => {
   const res = await api.patch(`/profile/update-password/${adminId}`, { password: newPassword });
   return res.data;
}