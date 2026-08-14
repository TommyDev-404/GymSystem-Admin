import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { PaymentFiltersType } from "@/features/payments/types/PaymentTypes";
import { getInitials } from "@/utils/initials";
import { TableLoader } from "@/components/shared/TableLoader";
import { usePayments } from "../hooks/usePayments";
import {
	CheckCircle2,
	Clock3,
	XCircle,
	RotateCcw,
} from "lucide-react";


interface Props {
	params: PaymentFiltersType;
}

const TH_CLASS = "text-left text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold px-5 py-4";
const TD_CLASS = "px-5 py-4";

const paymentTypeConfig = {
	Membership: {
		label: "Membership",
		className:
			"bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
	},
	Renewal: {
		label: "Renewal",
		className:
			"bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
	},
	Upgrade: {
		label: "Upgrade",
		className:
			"bg-violet-50 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
	},
} as const;

const statusConfig = {
	Paid: {
		color:
			"bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
		icon: CheckCircle2,
	},

	Pending: {
		color:
			"bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
		icon: Clock3,
	},

	Cancelled: {
		color:
			"bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
		icon: XCircle,
	},

	Refunded: {
		color:
			"bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
		icon: RotateCcw,
	},
} as const;

export function PaymentsTable({ params }: Props) {
	const { data: payments = [], isLoading } = usePayments(params);
	
	return (
		<Card className="rounded-2xl shadow-sm overflow-hidden p-0">
			<CardContent className="p-0">
				<Table className="text-sm">
					<TableHeader>
						<TableRow className="hover:bg-transparent bg-slate-50/70 dark:bg-stone-900/50">
							<TableHead className={TH_CLASS}>Member</TableHead>
							<TableHead className={TH_CLASS}>Plan</TableHead>
							<TableHead className={TH_CLASS}>Type</TableHead>
							<TableHead className={TH_CLASS}>Amount</TableHead>
							<TableHead className={TH_CLASS}>Method</TableHead>
							<TableHead className={TH_CLASS}>Status</TableHead>
							<TableHead className={TH_CLASS}>Paid On</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{isLoading ? (
							<TableLoader />
						) : payments.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className="text-center py-14 text-slate-400 dark:text-slate-500"
								>
									<div className="flex flex-col items-center gap-1">
										<p className="font-medium text-slate-500 dark:text-slate-400">
											No payments found
										</p>

										<p className="text-xs">
											Payment transactions will appear here.
										</p>
									</div>
								</TableCell>
							</TableRow>
						) : (
							payments.map((p) => {
								const status = statusConfig[p.status];
								const paymentType = paymentTypeConfig[p.paymentType as keyof typeof paymentTypeConfig];

								return (
									<TableRow
										key={p.id}
										className="group hover:bg-slate-50/70 dark:hover:bg-stone-800/50 transition-colors border-slate-100 dark:border-stone-800"
									>
										{/* MEMBER */}
										<TableCell className={TD_CLASS}>
											<div className="flex items-center gap-3">
												<Avatar className="h-9 w-9 shrink-0">
													<AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-semibold">
														{getInitials(
															p.memberName
														)}
													</AvatarFallback>
												</Avatar>

												<div className="min-w-0">
													<p className="font-medium text-slate-700 dark:text-slate-100 truncate">
														{p.memberName}
													</p>

													<p className="text-xs text-slate-400 dark:text-slate-500">
														Payment #{p.id}
													</p>
												</div>
											</div>
										</TableCell>

										{/* PLAN */}
										<TableCell className={TD_CLASS}>
											<Badge className="bg-indigo-50 text-indigo-700 hover:bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/30 border-0 font-medium">
												{p.plan}
											</Badge>
										</TableCell>

										{/* PAYMENT TYPE */}
										<TableCell className={TD_CLASS}>
											{paymentType ? (
												<Badge
													className={`${paymentType.className} border-0 font-medium hover:opacity-100`}
												>
													{paymentType.label}
												</Badge>
											) : (
												<span className="text-slate-400">
													-
												</span>
											)}
										</TableCell>

										{/* AMOUNT */}
										<TableCell className={`${TD_CLASS} font-semibold text-slate-700 dark:text-slate-100`}>
											{new Intl.NumberFormat(
												"en-PH",
												{
													style: "currency",
													currency: "PHP",
												}
											).format(Number(p.amount))}
										</TableCell>

										{/* PAYMENT METHOD */}
										<TableCell className={`${TD_CLASS} text-slate-500 dark:text-slate-400`}>
											{p.paymentMethod ?? "-"}
										</TableCell>

										{/* STATUS */}
										<TableCell className={TD_CLASS}>
											<Badge className={`gap-1.5 border font-medium hover:bg-inherit ${status.color}`}>
												<status.icon className="h-3 w-3" />
												{p.status}
											</Badge>
										</TableCell>

										{/* PAID DATE */}
										<TableCell className={`${TD_CLASS} text-slate-500 dark:text-slate-400`}>
											{p.paidDate ? (
												<div>
													<p className="font-medium text-slate-600 dark:text-slate-300">
														{new Date(
															p.paidDate
														).toLocaleDateString(
															"en-PH",
															{
																month: "short",
																day: "2-digit",
																year: "numeric",
															}
														)}
													</p>

													<p className="text-xs text-slate-400 dark:text-slate-500">
														{new Date(
															p.paidDate
														).toLocaleTimeString(
															"en-PH",
															{
																hour: "numeric",
																minute: "2-digit",
															}
														)}
													</p>
												</div>
											) : (
												<Badge className="bg-slate-100 text-slate-400 dark:bg-stone-800 dark:text-slate-500 border-0">
													Not paid
												</Badge>
											)}
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}