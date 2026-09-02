import type { Member } from "@/features/members/types/member";
import { getInitials } from "@/utils/initials";
import { ChevronRight, Trophy, Users } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const MAX_POINTS = 1000;

const tierConfig = {
  Bronze: {
    min: 200,
    color:
      "bg-[#963348]/10 text-[#963348] dark:bg-[#963348]/20 dark:text-[#C45A6D]",
  },
  Silver: {
    min: 400,
    color:
      "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  },
  Gold: {
    min: 700,
    color:
      "bg-[#963348]/10 text-[#7A1F31] dark:bg-[#963348]/20 dark:text-[#C45A6D]",
  },
  Platinum: {
    min: 850,
    color:
      "bg-[#7A1F31]/10 text-[#7A1F31] dark:bg-[#7A1F31]/20 dark:text-[#C45A6D]",
  },
} as const;

type TierName = keyof typeof tierConfig;

const getTier = (points: number): TierName | "Starter" => {
  if (points >= 850) return "Platinum";
  if (points >= 700) return "Gold";
  if (points >= 400) return "Silver";
  if (points >= 200) return "Bronze";
  return "Starter";
};

export function RewardsLeaderboard({
  memberProgress,
}: {
  memberProgress: Member[];
}) {
  return (
    <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm dark:border-slate-800">
      <CardHeader className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#963348]/10 dark:bg-[#963348]/20">
              <Trophy
                className="h-4.5 w-4.5 text-[#963348] dark:text-[#C45A6D]"
                strokeWidth={2}
              />
            </div>

            <div>
              <CardTitle className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Member Progress
              </CardTitle>
              <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                Reward points and membership tiers
              </p>
            </div>
          </div>

          {memberProgress.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500">
              <Users className="h-3.5 w-3.5" />
              <span>{memberProgress.length}</span>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="h-[390px] p-0">
        {memberProgress.length > 0 ? (
          <div className="h-full overflow-y-auto px-5 py-4">
            <div className="space-y-5">
              {memberProgress.map((member, index) => {
                const points = Number(member.points ?? 0);
                const progress = Math.min(
                  (points / MAX_POINTS) * 100,
                  100
                );
                const tierName = getTier(points);
                const tier =
                  tierName !== "Starter" ? tierConfig[tierName] : null;

                return (
                  <div key={index} className="group">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-[#963348] text-white text-xs font-semibold">
                          {getInitials(member.fullname)}
                        </AvatarFallback>
                      </Avatar>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                            {member.fullname}
                          </p>

                          {tier ? (
                            <Badge
                              className={`shrink-0 border-0 px-2 py-0.5 text-[10px] font-semibold ${tier.color}`}
                            >
                              {tierName}
                            </Badge>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="shrink-0 px-2 py-0.5 text-[10px]"
                            >
                              Starter
                            </Badge>
                          )}
                        </div>

                        <div className="mt-0.5 flex items-center justify-between">
                          <span className="text-xs text-slate-400 dark:text-slate-500">
                            {points.toLocaleString()} pts
                          </span>

                          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                            {Math.round(progress)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center gap-2">
                      <Progress
                        value={progress}
                        className="h-1.5 flex-1 bg-slate-100 dark:bg-slate-800 [&>div]:bg-[#963348]"
                      />

                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 dark:text-slate-700" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#963348]/10 dark:bg-[#963348]/20">
              <Trophy className="h-7 w-7 text-[#963348] dark:text-[#C45A6D]" />
            </div>

            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              No member progress yet
            </h3>

            <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-400 dark:text-slate-500">
              Member points and reward progress will appear here once
              available.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}