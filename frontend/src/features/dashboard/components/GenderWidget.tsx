import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function GenderWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Gender Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          Male / Female breakdown
        </p>
      </CardHeader>

      <CardContent>
        {/* Progress bar */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden">
            <div className="h-full bg-emerald-500 w-[58%]" />
          </div>

          <span className="text-xs text-muted-foreground">
            58%
          </span>
        </div>
      </CardContent>
    </Card>
  );
}