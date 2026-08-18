import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { HOVER_EFFECT } from "@/utils/animations";

type StatCardProps = {
	title: string;
	value: string;
	sub?: string;
	icon: React.ElementType;
	trend?: string;
	trendUp?: boolean;
	trendLabel?: string;
	color: string;
	iconColor: string;
};

export function StatCard({
	title,
	value,
	sub,
	icon: Icon,
	trend,
	trendUp,
	trendLabel,
	color,
	iconColor,
}: StatCardProps) {
	return (
		<Card
			className={`
				overflow-hidden
				border-slate-200
				shadow-sm
				dark:border-slate-800
				${HOVER_EFFECT}
			`}
		>
			<CardContent className="px-5 py-2">
				<div className="flex items-start justify-between gap-4">
					{/* CONTENT */}
					<div className="min-w-0">
						<p
							className="
								text-sm
								font-medium
								text-slate-500
								dark:text-slate-400
							"
						>
							{title}
						</p>

						<p
							className="
								mt-2
								text-2xl
								font-bold
								tracking-tight
								text-slate-800
								dark:text-slate-100
							"
						>
							{value}
						</p>

						{sub && (
							<p
								className="
									mt-1
									text-xs
									text-slate-400
									dark:text-slate-500
								"
							>
								{sub}
							</p>
						)}
					</div>

					{/* ICON */}
					<div
						className={`
							flex
							h-11
							w-11
							shrink-0
							items-center
							justify-center
							rounded-xl
							${color}
						`}
					>
						<Icon
							size={20}
							strokeWidth={2}
							className={iconColor}
						/>
					</div>
				</div>

				{/* TREND */}
				{trend && (
					<div
						className="
							mt-4
							flex
							items-center
							gap-1.5
							border-t
							border-slate-100
							pt-3
							dark:border-slate-800
						"
					>
						<div
							className={`
								flex
								items-center
								gap-0.5
								text-xs
								font-semibold
								${
									trendUp
										? "text-emerald-600 dark:text-emerald-400"
										: "text-red-500 dark:text-red-400"
								}
							`}
						>
							{trendUp ? (
								<ArrowUpRight
									size={14}
									strokeWidth={2.5}
								/>
							) : (
								<ArrowDownRight
									size={14}
									strokeWidth={2.5}
								/>
							)}

							<span>{trend}</span>
						</div>

						{trendLabel && (
							<span
								className="
									text-xs
									font-normal
									text-slate-400
									dark:text-slate-500
								"
							>
								{trendLabel}
							</span>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}