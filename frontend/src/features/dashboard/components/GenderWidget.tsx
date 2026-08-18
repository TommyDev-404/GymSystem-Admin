import { Users, UserRound, UserRoundCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { GenderDistribution } from "../types/DashboardTypes";

interface GenderWidgetProps {
  data: GenderDistribution[];
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

  const dominantGender =
    male > female
      ? "Male"
      : female > male
        ? "Female"
        : "Equal";

  const dominantPercentage =
    male > female
      ? malePercentage
      : female > male
        ? femalePercentage
        : 50;

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Gender Distribution</CardTitle>

            <p className="mt-1 text-sm text-muted-foreground">
              Member demographic breakdown
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/30">
            <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Distribution */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium">
              Distribution
            </span>

            <span className="text-xs text-muted-foreground">
              {dominantGender !== "Equal"
                ? `${dominantGender} majority`
                : "Equal distribution"}
            </span>
          </div>

          <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="bg-emerald-500 transition-all"
              style={{
                width: `${malePercentage}%`,
              }}
            />

            <div
              className="bg-slate-400 transition-all"
              style={{
                width: `${femalePercentage}%`,
              }}
            />
          </div>
        </div>

        {/* Gender Stats */}
        <div className="grid grid-cols-2 gap-3">

          {/* Male */}
          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                  <UserRoundCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>

                <span className="text-sm font-medium">
                  Male
                </span>
              </div>

              <span className="text-sm font-semibold text-emerald-600">
                {malePercentage}%
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold">
              {male}
            </p>

            <p className="text-xs text-muted-foreground">
              members
            </p>
          </div>

          {/* Female */}
          <div className="rounded-xl border p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800">
                  <UserRound className="h-4 w-4 text-slate-500" />
                </div>

                <span className="text-sm font-medium">
                  Female
                </span>
              </div>

              <span className="text-sm font-semibold text-slate-500">
                {femalePercentage}%
              </span>
            </div>

            <p className="mt-3 text-2xl font-bold">
              {female}
            </p>

            <p className="text-xs text-muted-foreground">
              members
            </p>
          </div>

        </div>

        {/* Insight */}
        <div className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2.5 dark:bg-stone-800">
          <span className="text-xs text-muted-foreground">
            Largest group
          </span>

          <span className="text-xs font-semibold">
            {dominantGender === "Equal"
              ? "Equal"
              : `${dominantGender} · ${dominantPercentage}%`}
          </span>
        </div>

      </CardContent>
    </Card>
  );
}