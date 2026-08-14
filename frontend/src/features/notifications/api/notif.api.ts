import { api } from "@/lib/axios";

export const getAdminNotificationsApi = async (params?: { category: string }) => {
  try {
    const res = await api.get("/notifications", { params });
    return res.data;

  } catch (error) {
    console.error("Failed to fetch notifications: ", error);
    throw error;
  }
};

export const getNotificationCountApi = async () => {
  try {
    const res = await api.get("/notifications/count");
    return res.data;
  } catch (error) {
    console.error("Failed to fetch notification count: ", error);
    throw error;
  }
};

export const markNotifAsReadApi = async (id: number) => {
  try {
    const res = await api.patch(`/notifications/${id}/read`);
    return res.data;
  } catch (error) {
    console.error("Failed to mark notification as read: ", error);
    throw error;
  }
};

export const markAllNotifAsReadApi = async () => {
  try {
    const res = await api.patch("/notifications/read-all");
    return res.data;
  } catch (error) {
    console.error("Failed to mark all notifications as read: ", error);
    throw error;
  }
};

export const deleteNotificationApi = async (id: number) => {
  try {
    const res = await api.delete(`/notifications/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to delete notification:", error);
    throw error;
  }
};