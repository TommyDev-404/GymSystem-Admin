import { Button } from "@/components/ui/button";
import { typeConfig } from "@/features/notifications/constants/typeConfig";
import type { NotificationCount } from "../types/NotifTypes";

const filterTypes = [
  "All",
  "PAYMENT",
  "EXPIRY",
  "REWARD",
  "CHECK_IN",
] as const;

interface Props {
  filter: string;
  setFilter: (value: string) => void;
  typeCounts: NotificationCount["typeCounts"];
  allCount: number;
}

export function NotificationsFilters({
  filter,
  setFilter,
  typeCounts,
  allCount
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
            ? allCount
            : typeCounts.find((item) => item.type === f)?.count ?? 0;

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
            <span className="ml-1.5 text-xs opacity-80">
              ({count})
            </span>
          </Button>
        );
      })}
    </div>
  );
}