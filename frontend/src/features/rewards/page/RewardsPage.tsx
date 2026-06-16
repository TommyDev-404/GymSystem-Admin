import { useState } from "react";
import { Plus } from "lucide-react";

import { RewardsStats } from "@/features/rewards/components/RewardsStats";
import { RewardsList } from "@/features/rewards/components/RewardsList";
import { RewardsLeaderboard } from "@/features/rewards/components/RewardsLeaderboard";
import { CreateRewardModal } from "@/features/rewards/components/CreateRewardModal";


export function RewardsPage() {
  const [showForm, setShowForm] = useState(false);
  const [newReward, setNewReward] = useState({
    title: "",
    description: "",
    points: 100,
    category: "Fitness",
  });

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
      <RewardsStats />

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        <RewardsList />

        <RewardsLeaderboard />

      </div>

      {/* MODAL */}
      <CreateRewardModal
        open={showForm}
        setOpen={setShowForm}
        form={newReward}
        setForm={setNewReward}
      />

    </div>
  );
}