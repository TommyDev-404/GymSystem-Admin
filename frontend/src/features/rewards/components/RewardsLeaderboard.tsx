import type { Member } from "@/features/members/types/member";
import { getInitials } from "@/utils/initials";
import { Trophy } from "lucide-react";

const tierColors: Record<string, string> = {
  Bronze: "text-amber-700 bg-amber-100",
  Silver: "text-slate-600 bg-slate-200",
  Gold: "text-amber-500 bg-amber-50 border border-amber-200",
  Platinum: "text-indigo-600 bg-indigo-100",
};

const tierPoints: Record<number, string> = {
  200: "Bronze",
  400: "Silver",
  700: "Gold",
  850: "Platinum",
};

export function RewardsLeaderboard({ memberProgress } : { memberProgress: Member[]}) {
  const MAX_POINTS = 1000;

  return (
    <div className="space-y-3">
      <h3 className="text-slate-700 font-medium">Member Progress</h3>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
        {memberProgress.length > 0 ? (
          memberProgress.map((m: Member) => {
            const progress = (m.points! / MAX_POINTS) * 100;
            const tierName = tierPoints[m.points!];

            return (
              <div key={m.fullname}>
                {/* Header row */}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <span className="text-emerald-700 text-xs font-semibold">
                      {getInitials(m.fullname)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 text-sm font-medium truncate">
                        {m.fullname}
                      </span>

                      <span
                        className={`ml-2 px-2 py-0.5 rounded-md text-xs font-medium ${
                          tierColors[tierName]
                        }`}
                      >
                        {tierName}
                      </span>
                    </div>

                    <span className="text-slate-400 text-xs">
                      {m.points} / 1000 pts
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-emerald-500 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Trophy className="h-7 w-7 text-slate-400" />
            </div>

            <h3 className="text-sm font-semibold text-slate-700">
              No member progress yet
            </h3>

            <p className="mt-1 max-w-xs text-sm text-slate-400">
              Member points and reward progress will appear here once available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}


         