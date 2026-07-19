import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { GenderDistribution } from "../types/DashboardTypes";

interface GenderWidgetProps {
  data: GenderDistribution[]
}

export function GenderWidget({ data }: GenderWidgetProps) {
  const male = data.find((item) => item.name === "Male")?.value ?? 0;
  const female = data.find((item) => item.name === "Female")?.value ?? 0;

  const total = male + female;

  const malePercentage = total
    ? Math.round((male / total) * 100)
    : 0;

  const femalePercentage = total
    ? Math.round((female / total) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gender Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          Male and female member breakdown
        </p>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Progress */}
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
          <div
            className="h-full bg-emerald-500"
            style={{
              width: `${malePercentage}%`,
            }}
          />

          <div
            className="h-full bg-slate-400"
            style={{
              width: `${femalePercentage}%`,
            }}
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-sm text-muted-foreground">
                Male
              </span>
            </div>

            <p className="text-2xl font-semibold">
              {male}
            </p>

            <p className="text-xs text-muted-foreground">
              {malePercentage}% of members
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-400" />
              <span className="text-sm text-muted-foreground">
                Female
              </span>
            </div>

            <p className="text-2xl font-semibold">
              {female}
            </p>

            <p className="text-xs text-muted-foreground">
              {femalePercentage}% of members
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}