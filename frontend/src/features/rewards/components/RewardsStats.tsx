import { Card, CardContent } from "@/components/ui/card";
import { HOVER_EFFECT } from "@/utils/animations";
import { Trophy, Gift, Star, Zap } from "lucide-react";

interface Props {
  summaryData: {
    active: number,
    averagePoints: number,
    totalRewards: number,
    totalClaimed: number
  };
}

export function RewardsStats({ summaryData } : Props) {
  
  const stats = [
    {
      label: "Total Rewards",
      value: summaryData.totalRewards ?? 0,
      icon: Trophy,
      color: "bg-amber-500",
    },
    {
      label: "Total Claims",
      value: summaryData.totalClaimed ?? 0,
      icon: Gift,
      color: "bg-emerald-500",
    },
    {
      label: "Active Members",
      value: summaryData.active ?? 0,
      icon: Star,
      color: "bg-indigo-500",
    },
    {
      label: "Avg Points Earned",
      value: summaryData.averagePoints ?? 0,
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