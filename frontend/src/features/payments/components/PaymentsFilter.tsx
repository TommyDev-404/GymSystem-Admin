import { Search, CalendarDays } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { PaymentType } from "../types/PaymentTypes";

interface Props {
	search: string;
	setSearch: (value: string) => void;

	paymentType: PaymentType;
	setPaymentType: (value: PaymentType) => void;

	date: Date | undefined;
	setDate: (value: Date | undefined) => void;
}

export function PaymentFilters({
	search,
	setSearch,
	paymentType,
	setPaymentType,
	date,
	setDate,
}: Props) {
	return (
		<Card className="rounded-2xl border-slate-200 shadow-sm dark:border-stone-800">
			<CardContent className="flex flex-wrap items-center gap-3 p-3">
				{/* SEARCH */}
				<div className="relative min-w-[220px] flex-1">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

					<Input
						placeholder="Search member..."
						value={search}
						onChange={(e) =>
							setSearch(e.target.value)
						}
						className="
							h-10
							rounded-xl
							border-slate-200
							bg-slate-50
							pl-9
							text-sm
							text-slate-700
							focus-visible:ring-2
							focus-visible:ring-emerald-400
							dark:border-stone-700
							dark:bg-stone-800
							dark:text-slate-200
						"
					/>
				</div>

				{/* PAYMENT TYPE */}
				<Select
					value={paymentType}
					onValueChange={setPaymentType}
				>
					<SelectTrigger
						className="
							h-10
							w-[200px]
							rounded-xl
							border-slate-200
							bg-white
							px-6
							text-[14px]
							font-medium
							text-slate-600
							dark:border-stone-700
							dark:bg-stone-800
							dark:text-slate-300
						"
					>
						<SelectValue placeholder="Payment type" />
					</SelectTrigger>

					<SelectContent
						position="popper"
						sideOffset={6}
						className="
							z-[100]
							w-[200px]
							rounded-xl
							border-slate-200
							bg-white
							p-1
							shadow-lg
							animate-in
							fade-in-0
							zoom-in-95
							duration-150
							data-[state=closed]:animate-out
							data-[state=closed]:fade-out-0
							data-[state=closed]:zoom-out-95
							dark:border-stone-700
							dark:bg-stone-900
						"
					>
						<SelectItem
							value="All"
							className="rounded-lg text-sm"
						>
							All payments
						</SelectItem>

						<SelectItem
							value="Membership"
							className="rounded-lg text-sm"
						>
							Membership
						</SelectItem>

						<SelectItem
							value="Renewal"
							className="rounded-lg text-sm"
						>
							Renewal
						</SelectItem>

						<SelectItem
							value="Upgrade"
							className="rounded-lg text-sm"
						>
							Upgrade
						</SelectItem>
					</SelectContent>
				</Select>

				{/* DATE */}
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="outline"
							className="
								h-10
								w-[190px]
								justify-start
								gap-2
								rounded-xl
								border-slate-200
								bg-white
								px-3
								text-sm
								font-medium
								text-slate-600
								dark:border-stone-700
								dark:bg-stone-800
								dark:text-slate-300
							"
						>
							<CalendarDays className="h-4 w-4 text-slate-400" />

							<span className="truncate">
								{date
									? format(
											date,
											"MMM dd, yyyy"
										)
									: "Select date"}
							</span>
						</Button>
					</PopoverTrigger>

					<PopoverContent
						align="end"
						sideOffset={6}
						className="
							w-auto
							rounded-xl
							border-slate-200
							bg-white
							p-0
							shadow-lg
							dark:border-stone-700
							dark:bg-stone-900
						"
					>
						<Calendar
							mode="single"
							selected={date}
							onSelect={setDate}
							initialFocus
						/>

						{date && (
							<div className="border-t border-slate-100 p-2 dark:border-stone-800">
								<Button
									variant="ghost"
									onClick={() =>
										setDate(undefined)
									}
									className="
										h-8
										w-full
										rounded-lg
										text-xs
										text-slate-500
										hover:text-slate-700
										dark:text-slate-400
										dark:hover:text-slate-200
									"
								>
									Clear date
								</Button>
							</div>
						)}
					</PopoverContent>
				</Popover>
			</CardContent>
		</Card>
	);
}