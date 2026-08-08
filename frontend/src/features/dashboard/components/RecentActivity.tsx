import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatTimeAgo } from "@/utils/formatTimeAgo";

interface ActivityItem {
  name: string;
  action: string;
  time: Date;
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

        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock
              size={32}
              className="text-muted-foreground mb-3"
            />

            <p className="text-sm font-medium">
              No recent activity
            </p>

            <p className="text-xs text-muted-foreground">
              Member check-ins, payments, and updates will appear here.
            </p>
          </div>
        ) : (
          data.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3"
            >
              {/* Avatar */}
              <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-semibold text-emerald-700">
                  {item.avatar}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {item.name}
                </p>

                <p className="text-xs text-muted-foreground">
                  {item.action}
                </p>
              </div>

              {/* Time */}
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock size={11} />
                {formatTimeAgo(item.time)}
              </div>
            </div>
          ))
        )}

      </CardContent>
    </Card>
  );
}