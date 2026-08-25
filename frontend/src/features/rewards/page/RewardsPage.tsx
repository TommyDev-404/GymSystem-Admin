import { useState } from "react";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";

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
import PageHeader from "@/components/shared/PageHeader";


export function RewardsPage() {
	const [searchParams] = useSearchParams();
	const urlAction = searchParams.get("action");

	const { data: rewards = [], isLoading: rewardsLoading} = useGetAllRewards();
	const { data: memberProgress = [], isLoading: memberProgressLoading } = useGetMemberProgress();
	const { data: summaryData = {}, isLoading: summaryLoading } = useGetSummaryData();
	const { data: redeemedRewards = [], isLoading: redeemedLoading } = useGetRedeemedRewards();

	const [showForm, setShowForm] = useState(!!urlAction || false);

	if(
		rewardsLoading ||
		memberProgressLoading ||
		summaryLoading ||
		redeemedLoading
	) return <PageLoader/>;

	return (
		<div className="space-y-6">

			<PageHeader
				title="Rewards Management"
				subtitle="Manage rewards, member points, and redemption requests"
				icon={Plus}
				actionName="Create Reward"
				setOpen={()=>setShowForm(true)}
			/>

			<section>
				<RewardsStats summaryData={summaryData}/>
			</section>

			<section className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-start">
				<div className=" xl:col-span-2 h-[450px] overflow-hidden">
					<h3 className="text-slate-700 dark:text-slate-200 font-medium">Available Rewards</h3>	
					
					<div className="h-full overflow-y-auto p-2">
						<RewardsList rewards={rewards}/>
					</div>
				</div>

				<div>
					<RewardsLeaderboard memberProgress={memberProgress}/>
				</div>
			</section>

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

			<RewardModal
				open={showForm}
				onClose={()=>setShowForm(false)}
			/>
		</div>
	);
}