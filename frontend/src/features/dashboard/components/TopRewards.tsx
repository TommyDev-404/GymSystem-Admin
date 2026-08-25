import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Trophy } from "lucide-react";

interface TopReward {
  name: string;
  claimed: number;
}

interface TopRewardsProps {
  data: TopReward[];
}

export function TopClaimedRewards({ data }: TopRewardsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Claimed Rewards</CardTitle>
        <p className="text-sm text-muted-foreground">
          Most popular rewards among members
        </p>
      </CardHeader>

      <CardContent className="h-[350px] space-y-3">
        {data.length > 0 ? (
          data.slice(0, 5).map((reward, index) => (
            <div
              key={reward.name}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full ${
                    index === 0
                      ? "bg-[#963348]/10 text-[#963348] dark:bg-[#963348]/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {index === 0 ? (
                    <Trophy className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-semibold">{index + 1}</span>
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium">{reward.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Reward claimed
                  </p>
                </div>
              </div>

              <span className="text-sm font-semibold">
                {reward.claimed}x
              </span>
            </div>
          ))
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#963348]/10 dark:bg-[#963348]/20">
              <Gift className="h-6 w-6 text-[#963348]" />
            </div>

            <h3 className="text-sm font-semibold">No rewards claimed yet</h3>

            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Claimed rewards will appear here once members redeem their
              points.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}