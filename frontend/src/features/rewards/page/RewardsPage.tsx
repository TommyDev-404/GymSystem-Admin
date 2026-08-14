import { useState } from "react";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/PageLoader";

import { RewardsStats } from "@/features/rewards/components/RewardsStats";
import { RewardsList } from "@/features/rewards/components/RewardsList";
import { RewardsLeaderboard } from "@/features/rewards/components/RewardsLeaderboard";
import { RewardRedemptionsTable } from "@/features/rewards/components/RewardRedemptionsTable";
import { RewardModal } from "@/features/rewards/components/RewardModal";

import {
  useGetAllRewards,
  useGetMemberProgress,
  useGetRedeemedRewards,
  useGetSummaryData,
} from "../hook/useRewards";


export function RewardsPage() {
	const [searchParams] = useSearchParams();
	const urlAction = searchParams.get("action");

	const { data: rewards = [], isLoading: rewardsLoading} = useGetAllRewards();
	const { data: memberProgress = [], isLoading: memberProgressLoading } = useGetMemberProgress();
	const { data: summaryData = {}, isLoading: summaryLoading } = useGetSummaryData();
	const { data: redeemedRewards = [], isLoading: redeemedLoading } = useGetRedeemedRewards();

	const [showForm,setShowForm] = useState(!!urlAction);

	if(
		rewardsLoading ||
		memberProgressLoading ||
		summaryLoading ||
		redeemedLoading
	) return <PageLoader/>;

	return (
		<div className="space-y-6">
			<section className="flex items-center justify-between">
				<div>
					<h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">Rewards Management</h1>

					<p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
						Manage rewards, member points, and redemption requests
					</p>
				</div>

				<Button
					onClick={()=>setShowForm(true)}
					className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-5"
				>
					<Plus size={15}/>
					Create Reward
				</Button>
			</section>

			{/* ================= STATISTICS ================= */}
			<section>
				<RewardsStats summaryData={summaryData}/>
			</section>

			{/* ================= REWARD MANAGEMENT ================= */}
			<section className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
				{/* REWARDS LIST */}
				<div className=" xl:col-span-2 h-[450px] overflow-hidden">
					<h3 className="text-slate-700 dark:text-slate-200 font-medium">Available Rewards</h3>	
					
					<div className="h-full overflow-y-auto p-2">
						<RewardsList rewards={rewards}/>
					</div>
				</div>

				{/* LEADERBOARD */}
				<div>
					<RewardsLeaderboard memberProgress={memberProgress}/>
				</div>
			</section>

			{/* ================= REDEMPTION MANAGEMENT ================= */}
			<section className="space-y-3">
				<div>
					<h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
						Reward Redemptions
					</h2>

					<p className="text-sm text-slate-500">
						Review and manage member reward claims
					</p>
				</div>

				<RewardRedemptionsTable
					redemptions={redeemedRewards}
					isLoading={false}
				/>
			</section>

			{/* ================= CREATE MODAL ================= */}
			<RewardModal
				open={showForm}
				onClose={()=>setShowForm(false)}
			/>
		</div>
	);
}