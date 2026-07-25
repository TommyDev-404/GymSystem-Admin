import { useState } from "react";
import { Plus } from "lucide-react";

import { RewardsStats } from "@/features/rewards/components/RewardsStats";
import { RewardsList } from "@/features/rewards/components/RewardsList";
import { RewardsLeaderboard } from "@/features/rewards/components/RewardsLeaderboard";
import { RewardModal } from "@/features/rewards/components/RewardModal";
import { useGetAllRewards, useGetMemberProgress, useGetSummaryData } from "../hook/useRewards";
import { PageLoader } from "@/components/shared/PageLoader";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function RewardsPage() {
  const [searchParams] = useSearchParams();
	
  const urlAction= searchParams.get("action");

  const { data: rewards = [], isLoading: rewardsLoading } = useGetAllRewards();
  const { data: memberProgress = [], isLoading: memberProgressLoading } = useGetMemberProgress();
  const { data: summaryData = {}, isLoading: rewardSummary } = useGetSummaryData();

  const [showForm, setShowForm] = useState(urlAction ? true : false);

  if (
    rewardsLoading ||
    memberProgressLoading ||
    rewardSummary
  ) return <PageLoader />;

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
				<div>
					<h1 className="
						text-slate-800
						dark:text-slate-100
						font-bold
						text-xl
					">
						Rewards
					</h1>

					<p className="
						text-slate-500
						dark:text-slate-400
						text-sm
						mt-0.5
					">
						Manage members reward program
					</p>
				</div>

				<Button
					className="
						bg-emerald-500
						dark:bg-emerald-600
						py-5
						px-3
						hover:bg-emerald-600
						dark:hover:bg-emerald-700
						text-white
					"
					onClick={() => setShowForm(true)}
				>
					<Plus size={14} />
					Create Reward
				</Button>
      </div>
      
      {/* STATS */}
      <RewardsStats summaryData={summaryData}/>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <RewardsList rewards={rewards}/>

        <RewardsLeaderboard memberProgress={memberProgress}/>
      </div>

      {/* MODAL */}
      <RewardModal
        open={showForm}
        onClose={() => setShowForm(false)}
      />

    </div>
  );
}