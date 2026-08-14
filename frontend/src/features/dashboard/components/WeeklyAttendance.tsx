import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { WeeklyAttendance } from "../types/DashboardTypes";

interface WeeklyAttendanceProps {
  data: WeeklyAttendance[];
}

export function WeeklyAttendance({ data }: WeeklyAttendanceProps) {
  return (
    <Card className="lg:col-span-2 h-full">
      <CardHeader>
        <CardTitle>Weekly Attendance</CardTitle>
        <p className="text-sm text-muted-foreground">
          Member attendance this week
        </p>
      </CardHeader>

      <CardContent className="h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis
              domain={[0, 50]}
              ticks={[0, 10, 20, 30, 40, 50]}
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "var(--tooltip-bg)",
                border: "1px solid var(--tooltip-border)",
                borderRadius: "10px",
              }}
            />

            <Bar
              dataKey="presentMembers"
              name="Present Members"
              fill="#10B981"
              radius={[6, 6, 0, 0]}
              minPointSize={3}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}