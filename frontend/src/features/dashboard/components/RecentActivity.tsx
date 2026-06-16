import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityItem {
  name: string;
  action: string;
  time: string;
  avatar: string;
}

interface RecentActivityProps {
  data: ActivityItem[];
}

export function RecentActivity({ data }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {data.map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-emerald-700">
                {item.avatar}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1">
              <p className="text-sm font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">
                {item.action}
              </p>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={11} />
              {item.time}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}