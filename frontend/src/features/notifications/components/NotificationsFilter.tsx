import { Button } from "@/components/ui/button";
import { typeConfig } from "@/features/notifications/constants/typeConfig";
import type { NotificationCount } from "../types/NotifTypes";

const filterTypes = [
	"All",
	"PAYMENT",
	"MEMBERSHIP",
	"REWARD",
	"MEMBER",
	"ATTENDANCE",
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
	allCount,
}: Props) {
	return (
		<div className="flex flex-wrap items-center gap-2">
			{filterTypes.map((f) => {
				const isActive = filter === f;

				const config = f !== "All"
						? typeConfig[f]
						: null;

				const Icon = config?.icon;

				const label =
					f === "All"
						? "All"
						: config?.label;

				const count =
					f === "All"
						? allCount
						: typeCounts.find(
								(item) => item.category === f
							)?.count ?? 0;

				return (
					<Button
						key={f}
						variant="outline"
						onClick={() => setFilter(f)}
						className={`
							h-9
							gap-2
							rounded-lg
							border
							px-3
							text-sm
							font-medium
							transition-all

							${
								isActive
									? "border-emerald-500 bg-emerald-500 text-white shadow-sm hover:bg-emerald-600 hover:text-white"
									: "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-800 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
							}
						`}
					>
						{Icon && (
							<Icon
								className="h-4 w-4"
								strokeWidth={2}
							/>
						)}

						<span>{label}</span>

						<span
              className={`
                rounded-md
                px-1.5
                py-0.5
                text-[11px]
                font-semibold
                leading-none
                ${
                  count > 0
                    ? "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400"
                    : "bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                }
              `}
            >
              {count}
            </span>
					</Button>
				);
			})}
		</div>
	);
}