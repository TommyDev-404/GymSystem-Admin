// RevenueChart.tsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

export function RevenueChart({ data }: any) {
  return (
    <Card>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-slate-800 font-medium">Revenue vs Target</h3>
          <p className="text-slate-400 text-xs">
            Monthly comparison — Jan to Jul 2026
          </p>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="gRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Area dataKey="revenue" stroke="#10B981" fill="url(#gRevenue)" />
            <Area
              dataKey="target"
              stroke="#334155"
              strokeDasharray="5 5"
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}