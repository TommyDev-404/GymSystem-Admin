import { useQuery } from "@tanstack/react-query";
import * as api from "@/features/dashboard/api/dashboard.api";
import type { GenderDistribution, MemberStatus, RecentActivity, RevenueTrend, SummaryData, TopClaimedRewards, WeeklyAttendance } from "../types/DashboardTypes";

export function useGetDashboardSummaryData() {
  return useQuery<SummaryData>({
    queryKey: ["dashboard-summary-data"],
    queryFn: api.getDashboardSummaryDataApi,
  });
}

export function useGetMonthlyRevenueTrend() {
  return useQuery<RevenueTrend[]>({
    queryKey: ["dashboard-revenue-trend"],
    queryFn: api.getMonthlyRevenueTrendApi,
  });
}

export function useGetWeeklyAttendance() {
  return useQuery<WeeklyAttendance[]>({
    queryKey: ["dashboard-weekly-attendance"],
    queryFn: api.getWeeklyAttendanceApi,
  });
}

export function useGetMemberStatus() {
  return useQuery<MemberStatus[]>({
    queryKey: ["dashboard-member-status"],
    queryFn: api.getMemberStatusApi,
  });
}

export function useGenderDistribution() {
  return useQuery<GenderDistribution[]>({
    queryKey: ["dashboard-gender-distribution"],
    queryFn: api.getGenderDistributionApi,
  });
}

export function useGetTopClaimedRewards() {
  return useQuery<TopClaimedRewards[]>({
    queryKey: ["dashboard-top-claimed-rewards"],
    queryFn: api.getTopClaimedRewardsApi,
  });
}

export function useGetRecentActivity() {
  return useQuery<RecentActivity[]>({
    queryKey: ["dashboard-recent-activity"],
    queryFn: api.getRecentActivityApi,
  });
}