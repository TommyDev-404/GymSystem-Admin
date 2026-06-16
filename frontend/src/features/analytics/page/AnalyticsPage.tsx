// AnalyticsPage.tsx
import { TrendingUp, Users, CalendarCheck, DollarSign } from "lucide-react";

import { AnalyticsKpiCards } from "@/features/analytics/components/AnalyticsKpiCards";
import { RevenueChart } from "@/features/analytics/components/RevenueChart";
import { MemberGrowthChart } from "@/features/analytics/components/MemberGrowthChart";
import { AttendanceTrendsChart } from "@/features/analytics/components/AttendanceTrendsChart";
import { PlanRevenueBreakdown } from "@/features/analytics/components/PlanRevenueBreakdown";

const revenueData = [
   { month: "Jan", revenue: 18400, target: 20000 },
   { month: "Feb", revenue: 21000, target: 20000 },
   { month: "Mar", revenue: 19800, target: 22000 },
   { month: "Apr", revenue: 24300, target: 22000 },
   { month: "May", revenue: 22700, target: 24000 },
   { month: "Jun", revenue: 27500, target: 24000 },
   { month: "Jul", revenue: 29100, target: 26000 },
 ];

const memberGrowth = [
   { month: "Jan", total: 380, new: 22, churned: 8 },
   { month: "Feb", total: 394, new: 19, churned: 5 },
   { month: "Mar", total: 408, new: 21, churned: 7 },
   { month: "Apr", total: 426, new: 25, churned: 7 },
   { month: "May", total: 439, new: 18, churned: 5 },
   { month: "Jun", total: 452, new: 20, churned: 7 },
 ];

const attendanceTrends = [
   { week: "Wk 1", avg: 134 },
   { week: "Wk 2", avg: 148 },
   { week: "Wk 3", avg: 141 },
   { week: "Wk 4", avg: 162 },
   { week: "Wk 5", avg: 155 },
   { week: "Wk 6", avg: 173 },
   { week: "Wk 7", avg: 168 },
   { week: "Wk 8", avg: 181 },
];
 
const planRevenue = [
   { plan: "Basic", revenue: 6750, count: 150 },
   { plan: "Premium", revenue: 14230, count: 160 },
   { plan: "Elite", revenue: 6520, count: 47 },
 ];

export function AnalyticsPage() {
  const kpis = [
    {
      label: "Total Revenue (YTD)",
      value: "$162,800",
      change: "+14.2%",
      icon: DollarSign,
      color: "bg-emerald-500",
    },
    {
      label: "Member Growth",
      value: "+72",
      change: "+18.9%",
      icon: Users,
      color: "bg-indigo-500",
    },
    {
      label: "Avg Daily Check-ins",
      value: "147",
      change: "+8.4%",
      icon: CalendarCheck,
      color: "bg-violet-500",
    },
    {
      label: "Revenue / Member",
      value: "$64.2",
      change: "+3.1%",
      icon: TrendingUp,
      color: "bg-amber-500",
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="font-bold text-xl text-slate-800">Analytics</h1>
        <p className="text-slate-500 text-sm">
          Deep insights into your gym's performance
        </p>
      </div>

      {/* KPI */}
      <AnalyticsKpiCards kpis={kpis} />

      {/* Charts */}
      <RevenueChart data={revenueData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MemberGrowthChart data={memberGrowth} />
        <AttendanceTrendsChart data={attendanceTrends} />
      </div>

      {/* Breakdown */}
      <PlanRevenueBreakdown data={planRevenue} />
    </div>
  );
}