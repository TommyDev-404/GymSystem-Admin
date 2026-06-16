// MemberGrowthChart.tsx
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
import { Card, CardContent } from "@/components/ui/card";

export function MemberGrowthChart({ data }: any) {
  return (
    <Card>
      <CardContent>
        <h3 className="text-slate-800 font-medium">Membership Growth</h3>
        <p className="text-slate-400 text-xs mb-4">
          New vs churned members per month
        </p>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="new" fill="#10B981" />
            <Bar dataKey="churned" fill="#f87171" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}