import { api } from "@/lib/axios";

export const getDashboardSummaryDataApi = async () => {
  const res = await api.get("/dashboard/summary", );
  return res.data;
};

export const getMonthlyRevenueTrendApi = async () => {
  const res = await api.get("/dashboard/revenue-trend", );
  return res.data;
};

export const getWeeklyAttendanceApi = async () => {
  const res = await api.get("/dashboard/weekly-attendance", );
  return res.data;
};

export const getMemberStatusApi = async () => {
  const res = await api.get("/dashboard/member-status", );
  return res.data;
};

export const getGenderDistributionApi = async () => {
  const res = await api.get("/dashboard/gender-distribution", );
  return res.data;
};

export const getTopClaimedRewardsApi = async () => {
  const res = await api.get("/dashboard/top-claimed-rewards", );
  return res.data;
};

export const getRecentActivityApi = async () => {
  const res = await api.get("/dashboard/recent-activity", );
  return res.data;
};