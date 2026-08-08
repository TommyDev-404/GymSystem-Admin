import { api } from "@/lib/axios";
import type { UpdateAdminProfileDTO } from "../types/admin-info.types";

export const getAdminProfileApi = async (adminId: number) => {
   try {
      const res = await api.get(`/profile/${adminId}`);
      return res.data;
   } catch (error) {
      console.log("Error: ", error)
   }
};

export const updateAdminProfileApi = async (adminId: number, data: UpdateAdminProfileDTO) => {
   try {
      const res = await api.patch(`/profile/update-info/${adminId}`, data);
      return res.data;
   } catch (error) {
      console.log("Error: ", error)
   }
}

export const updateAdminPasswordApi = async (adminId: number, newPassword: string) => {
   try {
      const res = await api.patch(`/profile/update-password/${adminId}`, { password: newPassword });
      return res.data;
   } catch (error) {
      console.log("Error: ", error)
   }
}