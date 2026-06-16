// AttendanceTrendsChart.tsx
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export function AttendanceTrendsChart({ data }: any) {
  return (
    <Card>
      <CardContent>
        <h3 className="text-slate-800 font-medium">Attendance Trends</h3>
        <p className="text-slate-400 text-xs mb-4">
          Average weekly daily check-ins
        </p>

        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line
              dataKey="avg"
              stroke="#6366f1"
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}