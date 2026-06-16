import { Card, CardContent } from "@/components/ui/card";
import { HOVER_EFFECT } from "@/utils/animations";
import { Trophy, Gift, Star, Zap } from "lucide-react";

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

export function RewardsStats() {
  const stats = [
    {
      label: "Total Rewards",
      value: rewards.length,
      icon: Trophy,
      color: "bg-amber-500",
    },
    {
      label: "Total Claims",
      value: rewards.reduce((s, r) => s + r.claimedBy, 0),
      icon: Gift,
      color: "bg-emerald-500",
    },
    {
      label: "Active Members",
      value: 5,
      icon: Star,
      color: "bg-indigo-500",
    },
    {
      label: "Avg Points Earned",
      value: "628",
      icon: Zap,
      color: "bg-violet-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card
          key={s.label}
          className={HOVER_EFFECT}
        >
          <CardContent>
            <div
              className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}
            >
              <s.icon size={18} className="text-white" />
            </div>

            <p className="text-2xl font-semibold text-slate-800">
              {s.value}
            </p>

            <p className="text-slate-500 text-xs mt-1">
              {s.label}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}