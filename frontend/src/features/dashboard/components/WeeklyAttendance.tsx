import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface WeeklyAttendanceProps {
  data: {
    day: string;
    members: number;
    guests: number;
  }[];
}

export function WeeklyAttendance({ data }: WeeklyAttendanceProps) {
  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Weekly Attendance</CardTitle>
        <p className="text-sm text-muted-foreground">
          Members and guests this week
        </p>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar dataKey="members" fill="#10B981" />
            <Bar dataKey="guests" fill="#334155" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}