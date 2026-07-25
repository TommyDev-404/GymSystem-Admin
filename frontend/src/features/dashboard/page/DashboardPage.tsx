import {
  Users,
  UserCheck,
  DollarSign,
  TrendingUp,
  Activity
} from "lucide-react";

import { StatCard } from "@/features/dashboard/components/StatCard";
import { RevenueChart } from "@/features/dashboard/components/RevenueChart";
import { MembershipStatus } from "@/features/dashboard/components/MembershipStatus";
import { WeeklyAttendance } from "@/features/dashboard/components/WeeklyAttendance";
import { GenderWidget } from "@/features/dashboard/components/GenderWidget";
import { TopClaimedRewards } from "@/features/dashboard/components/TopRewards";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
import { useGenderDistribution, useGetDashboardSummaryData, useGetMemberStatus, useGetMonthlyRevenueTrend, useGetRecentActivity, useGetTopClaimedRewards, useGetWeeklyAttendance } from "../hooks/useDashboard";
import type { SummaryData } from "../types/DashboardTypes";
import { PageLoader } from "@/components/shared/PageLoader";

export function DashboardPage() {
  const { data: summaryData = {} as SummaryData, isLoading: summaryDataLoading } = useGetDashboardSummaryData();
  const { data: revenueTrend = [], isLoading: revenueTrendLoading } = useGetMonthlyRevenueTrend();
  const { data: weeklyAttendance = [], isLoading: weeklyAttendanceLoading } = useGetWeeklyAttendance();
  const { data: memberStatus = [], isLoading: memberStatusLoading } = useGetMemberStatus();
  const { data: genderDistribution = [], isLoading: genderDistributionLoading } = useGenderDistribution();
  const { data: topClaimedRewards = [], isLoading: topClaimedRewardsLoading } = useGetTopClaimedRewards();
  const { data: recentActivity = [], isLoading: recentActivityLoading } = useGetRecentActivity();

  const dataFetching =
    summaryDataLoading ||
    recentActivityLoading ||
    revenueTrendLoading ||
    weeklyAttendanceLoading ||
    memberStatusLoading ||
    genderDistributionLoading ||
    topClaimedRewardsLoading;
  
  if (dataFetching) return <PageLoader />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="
            text-slate-800 
            dark:text-slate-100
            font-bold 
            text-xl
          ">
            Dashboard
          </h1>

          <p className="
            text-slate-500 
            dark:text-slate-400
            text-sm 
            mt-0.5
          ">
            Monday, June 9, 2026
          </p>
        </div>

        <div className="
          flex 
          items-center 
          gap-2 
          bg-emerald-50 
          dark:bg-emerald-900/30
          border 
          border-emerald-200
          dark:border-emerald-800
          rounded-xl 
          px-4 
          py-2
        ">
          <Activity 
            size={15} 
            className="
              text-emerald-600
              dark:text-emerald-400
            " 
          />

          <span className="
            text-emerald-700
            dark:text-emerald-300
            text-sm 
            font-medium
          ">
            Gym Open
          </span>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={summaryData?.totalMembers?.toString() ?? "0"}
          sub={`New Members: ${summaryData?.newMembersThisMonth ?? 0}`}
          icon={Users}
          trend={`${summaryData?.memberTrend ?? 0}%`}
          trendUp={(summaryData?.memberTrend ?? 0) >= 0}
          trendLabel="vs last month"
          color="bg-emerald-500"
        />
        <StatCard
          title="Currently Present"
          value={summaryData?.currentlyPresent?.toString() ?? 0}
          sub={`Male: ${summaryData?.totalMalePresent ?? 0} · Female: ${summaryData?.totalFemalePresent ?? 0}`}
          icon={UserCheck}
          trend={`${summaryData?.presentTrend ?? 0}%`}
          trendUp={(summaryData?.presentTrend ?? 0) >= 0}
          trendLabel="vs yesterday"
          color="bg-indigo-500"
        />

        <StatCard
          title="Total Paid"
          value={new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP'}).format(summaryData?.totalPaidThisMonth ?? 0)}
          sub="This month"
          icon={DollarSign}
          trend={`${summaryData?.paymentTrendThisMonth ?? 0}%`}
          trendUp={(summaryData?.paymentTrendThisMonth ?? 0) >= 0}
          trendLabel="vs last month"
          color="bg-violet-500"
        />

        <StatCard
          title="Overall Income"
          value={new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP'}).format(summaryData?.totalPaidThisYear ?? 0)}
          sub="This year"
          icon={TrendingUp}
          trend={`${summaryData?.paymentTrendThisYear ?? 0}%`}
          trendUp={(summaryData?.paymentTrendThisYear ?? 0) >= 0}
          trendLabel="vs previous year"
          color="bg-amber-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Main Revenue Chart */}
        <RevenueChart data={revenueTrend} />

        <TopClaimedRewards data={topClaimedRewards} />
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Attendance takes more space */}
        <WeeklyAttendance data={weeklyAttendance} />

        {/* Right Side Widgets */}
        <div className="space-y-4">
          <MembershipStatus data={memberStatus} />

          <GenderWidget data={genderDistribution} />
        </div>
      </div>

      {/* Activity */}
      <RecentActivity data={recentActivity} />
    </div>
  );
}