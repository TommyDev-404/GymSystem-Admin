import { Card, CardContent } from "@/components/ui/card";
import { HOVER_EFFECT } from "@/utils/animations";
import {
	Trophy,
	Gift,
	Star,
	Zap,
} from "lucide-react";

interface Props {
	summaryData: {
		active: number;
		averagePoints: number;
		totalRewards: number;
		totalClaimed: number;
	};
}

export function RewardsStats({ summaryData }: Props) {
	const stats = [
		{
			label: "Total Rewards",
			value: summaryData.totalRewards ?? 0,
			description: "Available rewards",
			icon: Trophy,
			iconColor:
				"text-amber-600 dark:text-amber-400",
			iconBg:
				"bg-amber-50 dark:bg-amber-950/40",
		},
		{
			label: "Total Claims",
			value: summaryData.totalClaimed ?? 0,
			description: "Reward claims",
			icon: Gift,
			iconColor:
				"text-emerald-600 dark:text-emerald-400",
			iconBg:
				"bg-emerald-50 dark:bg-emerald-950/40",
		},
		{
			label: "Active Rewards",
			value: summaryData.active ?? 0,
			description: "Currently available",
			icon: Star,
			iconColor:
				"text-indigo-600 dark:text-indigo-400",
			iconBg:
				"bg-indigo-50 dark:bg-indigo-950/40",
		},
		{
			label: "Avg. Points Earned",
			value: summaryData.averagePoints ?? 0,
			description: "Average per member",
			icon: Zap,
			iconColor:
				"text-violet-600 dark:text-violet-400",
			iconBg:
				"bg-violet-50 dark:bg-violet-950/40",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
			{stats.map((stat) => {
				const Icon = stat.icon;

				return (
					<Card
						key={stat.label}
						className={`
							${HOVER_EFFECT}
							overflow-hidden
							border-slate-200
							bg-white
							shadow-sm
							dark:border-slate-800
							dark:bg-slate-900
						`}
					>
						<CardContent className="p-5">
							<div className="flex items-start justify-between gap-4">
								<div className="min-w-0">
									<p
										className="
											text-sm
											font-medium
											text-slate-500
											dark:text-slate-400
										"
									>
										{stat.label}
									</p>

									<p
										className="
											mt-1
											text-2xl
											font-bold
											tracking-tight
											text-slate-800
											dark:text-slate-100
										"
									>
										{stat.value.toLocaleString()}
									</p>

									<p
										className="
											mt-1
											text-xs
											text-slate-400
											dark:text-slate-500
										"
									>
										{stat.description}
									</p>
								</div>

								<div
									className={`
										flex
										h-11
										w-11
										shrink-0
										items-center
										justify-center
										rounded-xl
										${stat.iconBg}
									`}
								>
									<Icon
										className={`
											h-5
											w-5
											${stat.iconColor}
										`}
										strokeWidth={2}
									/>
								</div>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}