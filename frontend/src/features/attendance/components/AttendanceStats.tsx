import { Users, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { HOVER_EFFECT } from "@/utils/animations";

const stats = [
  {
    label: "Currently Present",
    value: "87",
    icon: Users,
    color: "bg-emerald-500",
  },
  {
    label: "Checked In Today",
    value: "203",
    icon: CheckCircle2,
    color: "bg-indigo-500",
  },
  {
    label: "Avg. Duration",
    value: "1h 22m",
    icon: Clock,
    color: "bg-amber-500",
  },
];

export function AttendanceStats() {
  return (
    <>
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className={HOVER_EFFECT}
        >
          <CardContent>
            {/* Icon */}
            <div
              className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center mb-3`}
            >
              <stat.icon size={18} className="text-white" />
            </div>

            {/* Value */}
            <p className="text-2xl font-semibold">{stat.value}</p>

            {/* Label */}
            <p className="text-slate-500 text-xs mt-1">{stat.label}</p>
          </CardContent>
        </Card>
      ))}
    </>
  );
}