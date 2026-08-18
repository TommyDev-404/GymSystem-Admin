import {
	Card,
	CardContent,
} from "@/components/ui/card";
import { HOVER_EFFECT } from "@/utils/animations";

import {
	RefreshCw,
	ArrowUpCircle,
	CreditCard,
} from "lucide-react";

type PaymentSummaryItem = {
	amount: number;
	count: number;
};

type PaymentSummary = {
	renewal: PaymentSummaryItem;
	upgrade: PaymentSummaryItem;
	membership: PaymentSummaryItem;
};

interface PaymentSummaryCardsProps {
	summary: PaymentSummary;
}

export function PaymentSummaryCards({
	summary,
}: PaymentSummaryCardsProps) {
	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-PH", {
			style: "currency",
			currency: "PHP",
			maximumFractionDigits: 2,
		}).format(amount);
	};

	const cards = [
		{
			title: "Renewal",
			amount: summary.renewal.amount,
			count: summary.renewal.count,
			description: "Membership renewals",
			icon: RefreshCw,
			iconColor:
				"text-emerald-600 dark:text-emerald-400",
			iconBg:
				"bg-emerald-50 dark:bg-emerald-950/40",
		},
		{
			title: "Upgrade",
			amount: summary.upgrade.amount,
			count: summary.upgrade.count,
			description: "Membership upgrades",
			icon: ArrowUpCircle,
			iconColor:
				"text-blue-600 dark:text-blue-400",
			iconBg:
				"bg-blue-50 dark:bg-blue-950/40",
		},
		{
			title: "Membership",
			amount: summary.membership.amount,
			count: summary.membership.count,
			description: "New memberships",
			icon: CreditCard,
			iconColor:
				"text-violet-600 dark:text-violet-400",
			iconBg:
				"bg-violet-50 dark:bg-violet-950/40",
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
							shadow-sm
							dark:border-slate-800
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
										{formatCurrency(card.amount)}
									</p>

									<div className="mt-1 flex items-center gap-1.5">
										<span
											className="
												text-xs
												font-medium
												text-slate-500
												dark:text-slate-400
											"
										>
											{card.count}
										</span>

										<span
											className="
												text-xs
												text-slate-400
												dark:text-slate-500
											"
										>
											{card.count === 1
												? "payment"
												: "payments"}
										</span>
									</div>
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

							<div
								className="
									mt-3
									border-t
									border-slate-100
									pt-3
									text-xs
									text-slate-400
									dark:border-slate-800
									dark:text-slate-500
								"
							>
								{card.description} · This month
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}