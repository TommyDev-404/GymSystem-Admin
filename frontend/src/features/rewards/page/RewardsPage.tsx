import { useState } from "react";
import { Plus } from "lucide-react";

import { RewardsStats } from "@/features/rewards/components/RewardsStats";
import { RewardsList } from "@/features/rewards/components/RewardsList";
import { RewardsLeaderboard } from "@/features/rewards/components/RewardsLeaderboard";
import { RewardModal } from "@/features/rewards/components/RewardModal";
import { useGetAllRewards, useGetMemberProgress, useGetSummaryData } from "../hook/useRewards";
import { PageLoader } from "@/components/shared/PageLoader";

export function RewardsPage() {
  const { data: rewards = [], isLoading: rewardsLoading } = useGetAllRewards();
  const { data: memberProgress = [], isLoading: memberProgressLoading } = useGetMemberProgress();
  const { data: summaryData = {}, isLoading: rewardSummary } = useGetSummaryData();

  const [showForm, setShowForm] = useState(false);

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
          <h1 className="text-slate-800 text-xl font-bold">Rewards</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Manage member reward programs
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600"
        >
          <Plus size={15} />
            Create Reward
        </button>
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