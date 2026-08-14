import {
	Card,
	CardContent,
} from "@/components/ui/card";
import { HOVER_EFFECT } from "@/utils/animations";

import {
	CheckCircle2,
	Clock3,
	CalendarX,
} from "lucide-react";

type MemberSummary = {
	active: number;
	activeMale: number;
	activeFemale: number;

	expiringSoon: number;
	expiringTomorrow: number;
	expiringWithin3Days: number;
	expiringWithin7Days: number;

	expired: number;
	expiredMale: number;
	expiredFemale: number;
};

interface MemberSummaryCardsProps {
	summary: MemberSummary;
}

export function MemberSummaryCards({
	summary,
}: MemberSummaryCardsProps) {
	const cards = [
		{
			title: "Active Members",
			value: summary.active,
			description: "Currently active memberships",
			breakdown: (
				<div className="mt-2 flex items-center gap-2 text-xs">
					<span className="text-slate-500 dark:text-slate-400">
						Male:{" "}
						<span className="font-medium text-slate-700 dark:text-slate-300">
							{summary.activeMale}
						</span>
					</span>

					<span className="text-slate-300 dark:text-slate-700">
						·
					</span>

					<span className="text-slate-500 dark:text-slate-400">
						Female:{" "}
						<span className="font-medium text-slate-700 dark:text-slate-300">
							{summary.activeFemale}
						</span>
					</span>
				</div>
			),
			icon: CheckCircle2,
			iconColor:
				"text-emerald-600 dark:text-emerald-400",
			iconBg:
				"bg-emerald-50 dark:bg-emerald-950/40",
		},
		{
			title: "Expiring Soon",
			value: summary.expiringSoon,
			description: "Memberships expiring within 7 days",
			icon: Clock3,
			iconColor:
				"text-amber-600 dark:text-amber-400",
			iconBg:
				"bg-amber-50 dark:bg-amber-950/40",
			breakdown: (
				<div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
					<span className="font-medium text-amber-600 dark:text-amber-400">
						{summary.expiringTomorrow} tomorrow
					</span>

					<span className="text-slate-300 dark:text-slate-700">
						·
					</span>

					<span className="text-slate-500 dark:text-slate-400">
						{summary.expiringWithin3Days} within 3 days
					</span>

					<span className="text-slate-300 dark:text-slate-700">
						·
					</span>

					<span className="text-slate-500 dark:text-slate-400">
						{summary.expiringWithin7Days} within 7 days
					</span>
				</div>
			),
		},
		{
			title: "Expired Members",
			value: summary.expired,
			description: "Memberships already expired",
			breakdown: (
				<div className="mt-2 flex items-center gap-2 text-xs">
					<span className="text-slate-500 dark:text-slate-400">
						Male:{" "}
						<span className="font-medium text-slate-700 dark:text-slate-300">
							{summary.expiredMale}
						</span>
					</span>

					<span className="text-slate-300 dark:text-slate-700">
						·
					</span>

					<span className="text-slate-500 dark:text-slate-400">
						Female:{" "}
						<span className="font-medium text-slate-700 dark:text-slate-300">
							{summary.expiredFemale}
						</span>
					</span>
				</div>
			),
			icon: CalendarX,
			iconColor:
				"text-rose-600 dark:text-rose-400",
			iconBg:
				"bg-rose-50 dark:bg-rose-950/40",
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-3">
			{cards.map((card) => {
				const Icon = card.icon;

				return (
					<Card
						key={card.title}
						className={`
							${HOVER_EFFECT}
							border-slate-200
							bg-white
							shadow-sm
							dark:border-slate-800
							dark:bg-slate-900
						`}
					>
						<CardContent className="px-5 py-2">
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
										{card.title}
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
										{card.value}
									</p>

									<p
										className="
											mt-1
											text-xs
											text-slate-400
											dark:text-slate-500
										"
									>
										{card.description}
									</p>

									{card.breakdown}
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
										${card.iconBg}
									`}
								>
									<Icon
										className={`
											h-5
											w-5
											${card.iconColor}
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