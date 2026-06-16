import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  unreadCount: number;
  onMarkAllRead: () => void;
}

export function NotificationsHeader({
  unreadCount,
  onMarkAllRead,
}: Props) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-slate-800 font-bold text-xl ">Notifications</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {unreadCount} unread alerts
          </p>
        </div>

        {unreadCount > 0 && (
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-white text-xs font-medium">
            {unreadCount}
          </span>
        )}
      </div>

      {unreadCount > 0 && (
        <Button
          variant="outline"
          onClick={onMarkAllRead}
          className="flex items-center gap-2"
        >
          <Check size={14} />
          Mark all read
        </Button>
      )}
    </div>
  );
}