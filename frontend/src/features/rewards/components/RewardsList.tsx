import { useState } from "react";
import {
  Backpack,
  Dumbbell,
  Pencil,
  Salad,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmationDialog } from "../../../components/shared/ConfirmationDialog";
import { EmptyReward } from "./EmptyReward";
import { RewardModal } from "./RewardModal";
import type { Rewards } from "../types/RewardsType";
import { useDeleteReward } from "../hook/useRewards";
import { toast } from "sonner";

const iconMap = {
  Fitness: Dumbbell,
  Nutrition: Salad,
  Loyalty: Backpack,
  Special: Sparkles,
};

const iconBg = "bg-[#963348] text-white";

const categoryStyle =
  "bg-[#963348]/10 text-[#963348] hover:bg-[#963348]/10";

export function RewardsList({ rewards }: { rewards: Rewards[] }) {
  const { mutate: deleteReward, isPending } = useDeleteReward();

  const [open, setOpen] = useState<"Edit" | "Delete" | null>(null);
  const [selectedReward, setSelectedReward] = useState<Rewards | undefined>();

  const handleEdit = (reward: Rewards) => {
    setSelectedReward(reward);
    setOpen("Edit");
  };

  const handleDelete = (reward: Rewards) => {
    setSelectedReward(reward);
    setOpen("Delete");
  };

  const handleClose = () => {
    setOpen(null);
    setSelectedReward(undefined);
  };

  return (
    <>
      <div className="space-y-3 lg:col-span-2">
        {rewards.length > 0 ? (
          rewards.map((reward) => {
            const Icon =
              iconMap[reward.category as keyof typeof iconMap] ?? Zap;

            return (
              <Card
                key={reward.id}
                className="rounded-2xl shadow-sm transition-shadow hover:shadow-md"
              >
                <CardContent className="flex gap-4 p-5">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconBg}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="truncate font-medium text-slate-800 dark:text-slate-100">
                          {reward.name}
                        </h4>

                        <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                          {reward.description}
                        </p>
                      </div>

                      <Badge className={`shrink-0 ${categoryStyle}`}>
                        {reward.category}
                      </Badge>
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400">
                          <Zap size={13} />
                          {reward.points_required} pts
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {reward.total_claim} claimed
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-[#963348]/10 dark:hover:bg-[#963348]/20"
                          onClick={() => handleEdit(reward)}
                        >
                          <Pencil
                            size={15}
                            className="text-[#963348] dark:text-[#C45A6D]"
                          />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/30"
                          onClick={() => handleDelete(reward)}
                        >
                          <Trash2
                            size={15}
                            className="text-red-500 dark:text-red-400"
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <div className="flex min-h-[400px] items-center justify-center">
            <EmptyReward />
          </div>
        )}
      </div>

      <RewardModal
        reward={selectedReward}
        open={open === "Edit"}
        onClose={handleClose}
      />

      <ConfirmationDialog
        open={open === "Delete"}
        name={selectedReward?.name}
        onClose={handleClose}
        type="Reward"
        isPending={isPending}
        onConfirm={() => {
          if (!selectedReward) return;

          deleteReward(selectedReward.id, {
            onSuccess: () => {
              toast.success("Reward deleted successfully!");
              handleClose();
            },
          });
        }}
      />
    </>
  );
}