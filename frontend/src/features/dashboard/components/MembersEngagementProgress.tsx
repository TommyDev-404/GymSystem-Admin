import { useMemo } from "react";
import { Activity } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type EngagementStatus =
  | "ACTIVE"
  | "AT_RISK"
  | "INACTIVE"
  | "NO_ATTENDANCE";

interface Member {
  id: number | string;
  engagement_status: EngagementStatus;
}

interface Props {
  members: Member[];
  isLoading?: boolean;
}

const STATUS_CONFIG = [
  {
    status: "ACTIVE",
    label: "Recently active",
    color: "bg-emerald-500",
    textColor: "text-emerald-600 dark:text-emerald-400",
    indicator: "bg-emerald-500",
    track: "bg-emerald-100/70 dark:bg-emerald-950/50",
  },
  {
    status: "AT_RISK",
    label: "At risk",
    color: "bg-amber-500",
    textColor: "text-amber-600 dark:text-amber-400",
    indicator: "bg-amber-500",
    track: "bg-amber-100/70 dark:bg-amber-950/50",
  },
  {
    status: "INACTIVE",
    label: "Inactive",
    color: "bg-rose-500",
    textColor: "text-rose-600 dark:text-rose-400",
    indicator: "bg-rose-500",
    track: "bg-rose-100/70 dark:bg-rose-950/50",
  },
] as const;

export function MembersEngagementProgress({
  members,
  isLoading = false,
}: Props) {
  const engagement = useMemo(() => {
    const counts = {
      ACTIVE: 0,
      AT_RISK: 0,
      INACTIVE: 0,
    };

    members.forEach((member) => {
      if (member.engagement_status in counts) {
        counts[member.engagement_status as keyof typeof counts]++;
      }
    });

    return {
      total: members.length,
      counts,
    };
  }, [members]);

  return (
    <Card className="overflow-hidden rounded-xl border-stone-200/80 shadow-sm transition-shadow hover:shadow-md dark:border-stone-800">
      <CardContent className="space-y-5 p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-violet-100 bg-violet-50 text-violet-600 dark:border-violet-900/50 dark:bg-violet-950/40 dark:text-violet-400">
            <Activity size={17} strokeWidth={1.8} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold tracking-tight text-stone-900 dark:text-stone-100">
              Membership engagement
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Are members actually attending?
            </p>
          </div>

          <span className="shrink-0 rounded-md bg-stone-100 px-2 py-1 text-xs font-medium tabular-nums text-stone-600 dark:bg-stone-800 dark:text-stone-300">
            {engagement.total} total
          </span>
        </div>

        <div className="border-t border-stone-100 dark:border-stone-800" />

        {isLoading ? (
          <div className="space-y-5">
            {STATUS_CONFIG.map((item) => (
              <div key={item.status} className="space-y-2">
                <div className="h-3.5 w-32 animate-pulse rounded bg-muted" />
                <div className="h-1.5 w-full animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-20 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-5">
            {STATUS_CONFIG.map((item) => {
              const count = engagement.counts[item.status];
              const percentage =
                engagement.total > 0
                  ? Math.round((count / engagement.total) * 100)
                  : 0;

              return (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`size-2 rounded-full ${item.indicator}`}
                      />
                      <span className="text-[13px] font-medium text-stone-700 dark:text-stone-300">
                        {item.label}
                      </span>
                    </div>

                    <span
                      className={`text-sm font-semibold tabular-nums ${item.textColor}`}
                    >
                      {percentage}%
                    </span>
                  </div>

                  <div
                    className={`h-1.5 w-full overflow-hidden rounded-full ${item.track}`}
                    role="progressbar"
                    aria-label={item.label}
                    aria-valuenow={percentage}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={`h-full rounded-full transition-[width] duration-500 ease-out ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    {count} {count === 1 ? "member" : "members"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}