import { api } from "@/lib/axios";

export const getDashboardSummaryDataApi = async () => {
  try {
    const res = await api.get("/dashboard/summary");
    return res.data;
  } catch (error) {
    console.error("Fetch dashboard summary failed:", error);
    throw error;
  }
};

export const getMonthlyRevenueTrendApi = async () => {
  try {
    const res = await api.get("/dashboard/revenue-trend");
    return res.data;
  } catch (error) {
    console.error("Fetch monthly revenue trend failed:", error);
    throw error;
  }
};

export const getMembershipsExpiryApi = async () => {
  try {
    const res = await api.get("/dashboard/memberships-expiry");
    return res.data;
  } catch (error) {
    console.error("Fetch memberships expiry failed:", error);
    throw error;
  }
};

export const getWeeklyAttendanceApi = async () => {
  try {
    const res = await api.get("/dashboard/weekly-attendance");
    return res.data;
  } catch (error) {
    console.error("Fetch weekly attendance failed:", error);
    throw error;
  }
};

export const getMemberStatusApi = async () => {
  try {
    const res = await api.get("/dashboard/member-status");
    return res.data;
  } catch (error) {
    console.error("Fetch member status failed:", error);
    throw error;
  }
};

export const getGenderDistributionApi = async () => {
  try {
    const res = await api.get("/dashboard/gender-distribution");
    return res.data;
  } catch (error) {
    console.error("Fetch gender distribution failed:", error);
    throw error;
  }
};

export const getTopClaimedRewardsApi = async () => {
  try {
    const res = await api.get("/dashboard/top-claimed-rewards");
    return res.data;
  } catch (error) {
    console.error("Fetch top claimed rewards failed:", error);
    throw error;
  }
};

export const getRecentActivityApi = async () => {
  try {
    const res = await api.get("/dashboard/recent-activity");
    return res.data;
  } catch (error) {
    console.error("Fetch recent activity failed:", error);
    throw error;
  }
};