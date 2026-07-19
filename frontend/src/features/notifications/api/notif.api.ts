import { api } from "@/lib/axios";

export const getAdminNotificationsApi = async (params?: { type: string }) => {
  try {
    const res = await api.get("/notifications/", { params });
    return res.data;
  } catch (error) {
    console.error("Failed to fetch notifications: ", error);
    throw error;
  }
};
