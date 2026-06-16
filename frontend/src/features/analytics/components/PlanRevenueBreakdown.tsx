// PlanRevenueBreakdown.tsx
import { Card, CardContent } from "@/components/ui/card";

export function PlanRevenueBreakdown({ data }: any) {
  return (
    <Card>
      <CardContent>
        <h3 className="text-slate-800 font-medium mb-4">
          Revenue by Membership Plan
        </h3>

        <div className="space-y-4">
          {data.map((p: any) => {
            const total = data.reduce((s: number, x: any) => s + x.revenue, 0);
            const pct = Math.round((p.revenue / total) * 100);

            return (
              <div key={p.plan}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{p.plan}</span>
                  <span>{pct}%</span>
                </div>

                <div className="h-2 bg-slate-100 rounded-full">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}