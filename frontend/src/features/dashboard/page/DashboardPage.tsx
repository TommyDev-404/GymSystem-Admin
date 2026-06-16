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
import { AttendanceToday } from "@/features/dashboard/components/AttendanceToday";
import { RecentActivity } from "@/features/dashboard/components/RecentActivity";

const revenueData = [
   { month: "Jan", revenue: 18400 },
   { month: "Feb", revenue: 21000 },
   { month: "Mar", revenue: 19800 },
   { month: "Apr", revenue: 24300 },
   { month: "May", revenue: 22700 },
   { month: "Jun", revenue: 27500 },
   { month: "Jul", revenue: 29100 },
 ];
 
  const memberStatusData = [
   { name: "Active", value: 342 },
   { name: "Inactive", value: 87 },
   { name: "Suspended", value: 23 },
 ];
 
  const weeklyAttendance = [
   { day: "Mon", members: 142, guests: 18 },
   { day: "Tue", members: 128, guests: 22 },
   { day: "Wed", members: 165, guests: 14 },
   { day: "Thu", members: 119, guests: 31 },
   { day: "Fri", members: 187, guests: 27 },
   { day: "Sat", members: 203, guests: 41 },
   { day: "Sun", members: 89, guests: 12 },
 ];
 
  const recentActivity = [
   {
     name: "Sarah Johnson",
     action: "Checked in",
     time: "2 min ago",
     avatar: "SJ",
   },
   {
     name: "Mike Chen",
     action: "Payment received",
     time: "15 min ago",
     avatar: "MC",
   },
   {
     name: "Emma Davis",
     action: "Membership renewed",
     time: "42 min ago",
     avatar: "ED",
   },
   {
     name: "Carlos Rivera",
     action: "New member registered",
     time: "1 hr ago",
     avatar: "CR",
   },
   {
     name: "Priya Patel",
     action: "Reward redeemed",
     time: "2 hrs ago",
     avatar: "PP",
   },
 ];

export function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-slate-800 font-bold text-xl">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-0.5">Monday, June 9, 2026</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2">
          <Activity size={15} className="text-emerald-600" />
          <span className="text-emerald-700 text-sm font-medium">Gym Open</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value="452"
          sub="Male: 262 · Female: 190"
          icon={Users}
          trend="+12% growth"
          trendUp
          color="bg-emerald-500"
        />
        <StatCard
          title="Currently Present"
          value="87"
          sub="Members: 71 · Guests: 16"
          icon={UserCheck}
          trend="+5 vs yesterday"
          trendUp
          color="bg-indigo-500"
        />
        <StatCard
          title="Total Paid"
          value="$28,450"
          sub="This month"
          icon={DollarSign}
          trend="+18% revenue"
          trendUp
          color="bg-violet-500"
        />
        <StatCard
          title="Monthly Income"
          value="$27,500"
          sub="July 2026"
          icon={TrendingUp}
          trend="+6.6% vs June"
          trendUp
          color="bg-amber-500"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <RevenueChart data={revenueData} />
        <MembershipStatus data={memberStatusData} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <WeeklyAttendance data={weeklyAttendance} />
        <div className="space-y-4">
          <GenderWidget />
          <AttendanceToday />
        </div>
      </div>

      <RecentActivity data={recentActivity} />
    </div>
  );
}