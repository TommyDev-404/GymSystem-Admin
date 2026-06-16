import { Card, CardContent } from "@/components/ui/card";

const tierColors: Record<string, string> = {
  Bronze: "text-amber-700 bg-amber-100",
  Silver: "text-slate-600 bg-slate-200",
  Gold: "text-amber-500 bg-amber-50 border border-amber-200",
  Platinum: "text-indigo-600 bg-indigo-100",
};

const memberProgress = [
  {
    name: "Priya Patel",
    avatar: "PP",
    points: 920,
    maxPoints: 1000,
    tier: "Gold",
  },
  {
    name: "Sarah Johnson",
    avatar: "SJ",
    points: 750,
    maxPoints: 1000,
    tier: "Gold",
  },
  {
    name: "Luca Ferrari",
    avatar: "LF",
    points: 640,
    maxPoints: 1000,
    tier: "Silver",
  },
  {
    name: "Emma Davis",
    avatar: "ED",
    points: 510,
    maxPoints: 1000,
    tier: "Silver",
  },
  {
    name: "Aisha Diallo",
    avatar: "AD",
    points: 320,
    maxPoints: 500,
    tier: "Bronze",
  },
  {
    name: "Mike Chen",
    avatar: "MC",
    points: 280,
    maxPoints: 500,
    tier: "Bronze",
  },
  {
    name: "James Wilson",
    avatar: "JW",
    points: 1100,
    maxPoints: 1200,
    tier: "Platinum",
  },
];

export function RewardsLeaderboard() {
  return (
    <div className="space-y-3">
      <h3 className="text-slate-700 font-medium">Member Progress</h3>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
        {memberProgress.map((m) => {
          const progress = (m.points / m.maxPoints) * 100;

          return (
            <div key={m.name}>
              {/* Header row */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <span className="text-emerald-700 text-xs font-semibold">
                    {m.avatar}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-700 text-sm font-medium truncate">
                      {m.name}
                    </span>

                    <span
                      className={`ml-2 px-2 py-0.5 rounded-md text-xs font-medium ${
                        tierColors[m.tier]
                      }`}
                    >
                      {m.tier}
                    </span>
                  </div>

                  <span className="text-slate-400 text-xs">
                    {m.points} / {m.maxPoints} pts
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
        })}
      </div>
    </div>
  );
}