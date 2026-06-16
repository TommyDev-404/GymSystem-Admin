import { Badge } from "@/components/ui/badge";
import { Dumbbell, Salad, Backpack, Sparkles, Zap } from "lucide-react";


const rewards = [
   {
     id: 1,
     title: "Free Personal Training Session",
     description: "1 hour with a certified trainer",
     points: 500,
     category: "Fitness",
     claimedBy: 12,
   },
   {
     id: 2,
     title: "Protein Shake Bundle",
     description: "5 premium protein shakes",
     points: 250,
     category: "Nutrition",
     claimedBy: 28,
   },
 ];

 
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

export function RewardsList() {
  return (
    <div className="lg:col-span-2 space-y-3">
      <h3 className="text-slate-700 font-medium">Available Rewards</h3>

      {rewards.map((r) => {
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
                  <h4 className="font-medium text-slate-800">{r.title}</h4>
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
                  {r.points} pts
               </span>
      
               <span className="text-xs text-muted-foreground">
                  {r.claimedBy} claimed
               </span>
               </div>
            </div>
         </div>
         );
      })}
    </div>
  );
}
 