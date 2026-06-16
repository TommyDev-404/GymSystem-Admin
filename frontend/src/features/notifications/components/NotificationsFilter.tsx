import { Button } from "@/components/ui/button";
import { typeConfig } from "@/features/notifications/constants/typeConfig";

const filterTypes = ["All", "payment", "expiry", "reward", "checkin", "alert"] as const;

interface Props {
  filter: string;
  setFilter: (value: string) => void;
  notifications: any[];
}

export function NotificationsFilters({
  filter,
  setFilter,
  notifications,
}: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {filterTypes.map((f) => {
        const label =
          f === "All"
            ? "All"
            : typeConfig[f as keyof typeof typeConfig].label;

        const count =
          f === "All"
            ? notifications.length
            : notifications.filter((n) => n.type === f).length;

        return (
          <Button
            key={f}
            variant={filter === f ? "default" : "outline"}
            onClick={() => setFilter(f)}
            className={
               filter === f
                 ? "bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl p-4"
                 : "rounded-xl p-4"
             }
          >
            {label}
            <span className="ml-1.5 text-xs opacity-80">({count})</span>
          </Button>
        );
      })}
    </div>
  );
}