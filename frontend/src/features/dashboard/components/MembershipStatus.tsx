import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MemberStatus } from "../types/DashboardTypes";

const COLORS = ["#10B981", "#334155", "#94a3b8"];

interface MembershipStatusProps {
  data: MemberStatus[];
}

export function MembershipStatus({ data }: MembershipStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Membership Status</CardTitle>
        <p className="text-sm text-muted-foreground">
          Active vs Inactive
        </p>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data}
              innerRadius={45}
              outerRadius={70}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--tooltip-bg)",
                border: "1px solid var(--tooltip-border)",
                borderRadius: "10px",
              }}
            />
            
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="space-y-2 mt-4">
          {data.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: COLORS[i] }}
                />
                <span className="text-muted-foreground">
                  {item.name}
                </span>
              </div>

              <span className="font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}