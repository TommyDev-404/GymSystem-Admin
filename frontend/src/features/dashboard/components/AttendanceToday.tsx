import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AttendanceToday() {
  const current = 87;
  const total = 452;
  const percent = Math.round((current / total) * 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Attendance</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold">{current}</span>
          <span className="text-sm text-muted-foreground mb-1">
            / {total} members
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-emerald-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-1">
          {percent}% attendance today
        </p>
      </CardContent>
    </Card>
  );
}