import { Badge } from "@/components/ui/badge";
import { Dumbbell, Salad, Backpack, Sparkles, Zap, EditIcon, Trash2 } from "lucide-react";
import { useState } from "react";
import { RewardModal } from "./RewardModal";
import type { Rewards } from "../types/RewardsType";
import { ConfirmationDialog } from "../../../components/ConfirmationDialog";
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
  Fitness: "bg-emerald-100 text-emerald-700",
  Nutrition: "bg-green-100 text-green-700",
  Loyalty: "bg-indigo-100 text-indigo-700",
  Special: "bg-purple-100 text-purple-700",
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
   };;

   return (
      <>
         <div className="lg:col-span-2 space-y-3">
            <h3 className="text-slate-700 font-medium">Available Rewards</h3>

            {rewards.length > 0 ? rewards.map((r) => {
               const Icon = iconMap[r.category as keyof typeof iconMap];
            
               return (
                  <div
                     key={r.id}
                     className="bg-white rounded-2xl p-5 border shadow-sm flex gap-4"
                  >
                     {/* ICON */}
                     <div
                        className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                           iconBg[r.category]
                        }`}
                     >
                        <Icon className="h-5 w-5" />
                     </div>
               
                     {/* CONTENT */}
                     <div className="flex-1">
                        <div className="flex justify-between gap-3">
                           <div>
                              <h4 className="font-medium text-slate-800">{r.name}</h4>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                 {r.description}
                              </p>
                           </div>
                  
                           <Badge className={catColors[r.category]}>
                              {r.category}
                           </Badge>
                        </div>
               
                        {/* FOOTER */}
                        <div className="flex justify-between mt-3">
                           <span className="text-sm font-semibold text-amber-600 flex items-center gap-1">
                              <Zap size={13} />
                              {r.points_required} pts
                           </span>
                  
                           <span className="text-xs text-muted-foreground">
                              {r.total_claim} claimed
                           </span>
                        </div>
                        <div className="flex justify-end items-center gap-3 mt-3">
                           <button
                              onClick={() => handleEdit(r)}
                           >
                              <EditIcon size={16} className={"text-green-500 cursor-pointer"} />
                           </button>

                           <button
                              onClick={() => handleDelete(r)}
                           >
                              <Trash2 size={16} className={"text-red-500 cursor-pointer"} />
                           </button>
                        </div>

                     </div>
                  </div>
               );
            })
               :
            <EmptyReward/>
         }
         </div>

         <RewardModal
            reward={selectedReward}
            open={open === "Edit" && true}
            onClose={() => setOpen(null)}
         />

         <ConfirmationDialog
            open={open === "Delete" && true}
            name={selectedReward?.name}
            onClose={() => setOpen(null)}
            type="Reward"
            isPending={isPending}
            onConfirm={() => {
               deleteReward(selectedReward!.id, {
                 onSuccess: () => {
                   toast.success(`Reward deleted successfully!`);
                  setOpen(null);
                 }
               })
            }}
         />
      </>
   );
}
 