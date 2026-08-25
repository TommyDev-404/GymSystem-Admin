import {
	Users,
	UserCheck,
	DollarSign,
	Activity,
	CalendarX,
 } from "lucide-react";
 import { StatCard } from "@/features/dashboard/components/StatCard";
 import { RevenueChart } from "@/features/dashboard/components/RevenueChart";
 import { MembershipStatus } from "@/features/dashboard/components/MembershipStatus";
 import { WeeklyAttendance } from "@/features/dashboard/components/WeeklyAttendance";
 import { GenderWidget } from "@/features/dashboard/components/GenderWidget";
 import { TopClaimedRewards } from "@/features/dashboard/components/TopRewards";
 import { RecentActivity } from "@/features/dashboard/components/RecentActivity";
 import { MembershipsExpiringSoon } from "../components/MembershipExpiringSoon";
 import {
	useGenderDistribution,
	useGetDashboardSummaryData,
	useGetMembershipsExpiry,
	useGetMemberStatus,
	useGetMonthlyRevenueTrend,
	useGetRecentActivity,
	useGetTopClaimedRewards,
	useGetWeeklyAttendance,
 } from "../hooks/useDashboard";
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
	const { data: membershipsExpiry = [], isLoading: membershipsExpiryLoading } = useGetMembershipsExpiry();
 
	const dataFetching =
	  summaryDataLoading ||
	  revenueTrendLoading ||
	  weeklyAttendanceLoading ||
	  memberStatusLoading ||
	  genderDistributionLoading ||
	  topClaimedRewardsLoading ||
	  membershipsExpiryLoading ||
	  recentActivityLoading;
 
	if (dataFetching) {
	  return <PageLoader />;
	}
 
	return (
		<div className="space-y-6">
			
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
						Dashboard
					</h1>
					<p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
						{new Date().toLocaleDateString("en-US", {
							weekday: "long",
							month: "long",
							day: "numeric",
							year: "numeric",
						})}
					</p>
				</div>

				<div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 dark:border-rose-800 dark:bg-rose-950/30">
					<Activity
						size={15}
						className="text-rose-600 dark:text-rose-400"
					/>
					<span className="text-sm font-medium text-rose-700 dark:text-rose-300">
						Gym Open
					</span>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
				<StatCard
					title="Total Members"
					value={summaryData?.totalMembers?.toString() ?? "0"}
					sub={`New Members: ${summaryData?.newMembersThisMonth ?? 0}`}
					icon={Users}
					trend={`${summaryData?.memberTrend ?? 0}%`}
					trendUp={(summaryData?.memberTrend ?? 0) >= 0}
					trendLabel="vs last month"
					color="bg-emerald-50 dark:bg-emerald-950/40"
					iconColor="text-emerald-600 dark:text-emerald-400"
				/>

				<StatCard
					title="Currently Present"
					value={summaryData?.currentlyPresent?.toString() ?? "0"}
					sub={`Male: ${summaryData?.totalMalePresent ?? 0} · Female: ${summaryData?.totalFemalePresent ?? 0}`}
					icon={UserCheck}
					trend={`${summaryData?.presentTrend ?? 0}%`}
					trendUp={(summaryData?.presentTrend ?? 0) >= 0}
					trendLabel="vs yesterday"
					color="bg-indigo-50 dark:bg-indigo-950/40"
					iconColor="text-indigo-600 dark:text-indigo-400"
				/>

				<StatCard
					title="Expired Memberships"
					value={summaryData?.totalExpiredMemberships?.toString() ?? "0"}
					sub="Currently expired"
					icon={CalendarX}
					trend={`${(summaryData?.expiredMembershipTrend ?? 0) >= 0 ? "+" : ""}${summaryData?.expiredMembershipTrend ?? 0}`}
					trendUp={(summaryData?.expiredMembershipTrend ?? 0) <= 0}
					trendLabel="vs last month"
					color="bg-rose-50 dark:bg-rose-950/40"
					iconColor="text-rose-600 dark:text-rose-400"
				/>

				<StatCard
					title="Monthly Revenue"
					value={new Intl.NumberFormat("en-PH", {
						style: "currency",
						currency: "PHP",
					}).format(summaryData?.totalPaidThisMonth ?? 0)}
					sub="This month"
					icon={DollarSign}
					trend={`${summaryData?.paymentTrendThisMonth ?? 0}%`}
					trendUp={(summaryData?.paymentTrendThisMonth ?? 0) >= 0}
					trendLabel="vs last month"
					color="bg-violet-50 dark:bg-violet-950/40"
					iconColor="text-violet-600 dark:text-violet-400"
				/>
			</div>

			<div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
			<div className="xl:col-span-2">
				<RevenueChart data={revenueTrend} />
			</div>
			<div className="xl:col-span-1">
				<MembershipsExpiringSoon data={membershipsExpiry} />
			</div>
			</div>

			<div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
			<div className="xl:col-span-2">
				<WeeklyAttendance data={weeklyAttendance} />
			</div>
			<div className="xl:col-span-1">
				<TopClaimedRewards data={topClaimedRewards} />
			</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
			<MembershipStatus data={memberStatus} />
			<GenderWidget data={genderDistribution} />
			</div>

			<RecentActivity data={recentActivity} />
	  </div>
	);
 }