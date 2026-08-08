import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dumbbell, Salad, Backpack, Sparkles, Zap, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { RewardModal } from "./RewardModal";
import type { Rewards } from "../types/RewardsType";
import { ConfirmationDialog } from "../../../components/shared/ConfirmationDialog";
import { EmptyReward } from "./EmptyReward";
import { toast } from "sonner";
import { useDeleteReward } from "../hook/useRewards";

const iconMap = {
  Fitness: Dumbbell,
  Nutrition: Salad,
  Loyalty: Backpack,
  Special: Sparkles,
};

const iconBg: Record<string, string> = {
  Fitness: "bg-emerald-500 text-white",
  Nutrition: "bg-green-500 text-white",
  Loyalty: "bg-indigo-500 text-white",
  Special: "bg-purple-500 text-white",
};

const catColors: Record<string, string> = {
  Fitness: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
  Nutrition: "bg-green-100 text-green-700 hover:bg-green-100",
  Loyalty: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
  Special: "bg-purple-100 text-purple-700 hover:bg-purple-100",
};

export function RewardsList({ rewards }: { rewards: Rewards[] }) {
  const { mutate: deleteReward, isPending } = useDeleteReward();

  const [open, setOpen] = useState<"Edit" | "Delete" | null>(null);
  const [selectedReward, setSelected] = useState<Rewards | undefined>(undefined);

  const handleEdit = (reward: Rewards) => {
    setSelected(reward);
    setOpen("Edit");
  };

  const handleDelete = (reward: Rewards) => {
    setSelected(reward);
    setOpen("Delete");
  };

  return (
    <>
      <div className="lg:col-span-2 space-y-3">

        {rewards.length > 0 ? (
          rewards.map((r) => {
            const Icon = iconMap[r.category as keyof typeof iconMap];

            return (
              <Card
                key={r.id}
                className="rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-5 flex gap-4">
                  {/* ICON */}
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      iconBg[r.category]
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="font-medium text-slate-800 dark:text-slate-100 truncate">
                          {r.name}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {r.description}
                        </p>
                      </div>

                      <Badge className={`shrink-0 ${catColors[r.category]}`}>
                        {r.category}
                      </Badge>
                    </div>

                    {/* FOOTER */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Zap size={13} />
                          {r.points_required} pts
                        </span>

                        <span className="text-xs text-muted-foreground">
                          {r.total_claim} claimed
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                          onClick={() => handleEdit(r)}
                        >
                          <Pencil size={15} className="text-emerald-600 dark:text-emerald-400" />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 hover:bg-red-50 dark:hover:bg-red-900/30"
                          onClick={() => handleDelete(r)}
                        >
                          <Trash2 size={15} className="text-red-500 dark:text-red-400" />
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
        onClose={() => setOpen(null)}
      />

      <ConfirmationDialog
        open={open === "Delete"}
        name={selectedReward?.name}
        onClose={() => setOpen(null)}
        type="Reward"
        isPending={isPending}
        onConfirm={() => {
          deleteReward(selectedReward!.id, {
            onSuccess: () => {
              toast.success(`Reward deleted successfully!`);
              setOpen(null);
            },
          });
        }}
      />
    </>
  );
}