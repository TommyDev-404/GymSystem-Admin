import type { Member } from "@/features/members/types/member";
import { getInitials } from "@/utils/initials";
import { Trophy } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const tierColors: Record<string, string> = {
  Bronze: "text-amber-700 bg-amber-100 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  Silver: "text-slate-600 bg-slate-200 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300",
  Gold: "text-amber-500 bg-amber-50 hover:bg-amber-50 border border-amber-200 dark:bg-amber-950/30 dark:border-amber-900 dark:text-amber-400",
  Platinum: "text-indigo-600 bg-indigo-100 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400",
};

const tierPoints: Record<number, string> = {
  200: "Bronze",
  400: "Silver",
  700: "Gold",
  850: "Platinum",
};

export function RewardsLeaderboard({ memberProgress }: { memberProgress: Member[] }) {
  const MAX_POINTS = 1000;

  return (
    <div className="space-y-3">
      <h3 className="text-slate-700 dark:text-slate-200 font-medium">
        Member Progress
      </h3>

      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-5 space-y-4">
          {memberProgress.length > 4 ? (
            memberProgress.map((m: Member) => {
              const progress = (m.points! / MAX_POINTS) * 100;
              const tierName = tierPoints[m.points!];

              return (
                <div key={m.fullname}>
                  {/* Header row */}
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar className="w-8 h-8 shrink-0">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-semibold">
                        {getInitials(m.fullname)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-200 text-sm font-medium truncate">
                          {m.fullname}
                        </span>

                        <Badge className={`ml-2 shrink-0 ${tierColors[tierName]}`}>
                          {tierName}
                        </Badge>
                      </div>

                      <span className="text-slate-400 dark:text-slate-500 text-xs">
                        {m.points} / 1000 pts
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <Progress
                    value={progress}
                    className="h-2 bg-slate-100 dark:bg-slate-800 [&>div]:bg-emerald-500"
                  />
                </div>
              );
            })
          ) : (
            <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 dark:bg-stone-800">
                <Trophy className="h-7 w-7 text-muted-foreground" />
              </div>

              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                No member progress yet
              </h3>

              <p className="mt-1 max-w-xs text-sm text-muted-foreground">
                Member points and reward progress will appear here once available.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}