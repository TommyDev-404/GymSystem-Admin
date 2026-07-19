import { Button } from "@/components/ui/button";
import { typeConfig } from "@/features/notifications/constants/typeConfig";
import { EmptyState } from "./EmptyState";

interface Props {
  notifications: any[];
  onRead: (id: number) => void;
  onDismiss: (id: number) => void;
}

export function NotificationsList({
  notifications,
  onRead,
  onDismiss,
}: Props) {
  return (
    <div className="space-y-2 ">
      {notifications.map((n) => {
        const cfg = typeConfig[n.type];
        const Icon = cfg.icon;

        return (
          <div
            key={n.id}
            className={`bg-white rounded-2xl p-4 shadow-sm border transition-all ${
              n.read
                ? "border-slate-100 opacity-70"
                : "border-emerald-200 bg-emerald-50/30"
            }`}
          >
            <div className="flex items-start gap-3">

              {/* ICON */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.color}`}
              >
                <Icon size={16} />
              </div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">

                  <div>
                    <p
                      className={`text-sm font-medium ${
                        n.read ? "text-slate-600" : "text-slate-800"
                      }`}
                    >
                      {n.title}
                    </p>

                    <p className="text-slate-500 text-xs mt-0.5">
                      {n.message}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex items-center gap-1.5 shrink-0">

                    {!n.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRead(n.id)}
                      >
                        <Check size={14} />
                      </Button>
                    )}

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDismiss(n.id)}
                    >
                      <X size={14} />
                    </Button>

                  </div>
                </div>

                <p className="text-slate-400 text-xs mt-1.5">
                  {n.time}
                </p>
              </div>

              {/* unread dot */}
              {!n.read && (
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1" />
              )}

            </div>
          </div>
        );
      })}
      
      {/* empty state */}
      {
        notifications.length === 0 && (
          <EmptyState
            title="No notifications"
            message="No notifications found in this category."
          />
        )
      }
    </div>
  );
}