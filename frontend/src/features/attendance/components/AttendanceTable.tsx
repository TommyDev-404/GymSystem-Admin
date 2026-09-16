import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { Attendance } from "../types/AttendanceTypes";
import { getInitials } from "@/utils/initials";
import { TableLoader } from "@/components/shared/TableLoader";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { useCheckoutMember } from "../hooks/useAttendance";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
	members: Attendance[];
	isLoading: boolean;
};

export function AttendanceTable({ members, isLoading }: Props) {
	const { mutate: checkout, isPending } = useCheckoutMember();

	const canCheckout = (
		checkinTime: string | null,
		dailyLimit: number | null
	) => {
		if (!checkinTime || !dailyLimit) return false;
	
		const checkin = new Date(checkinTime);
		const now = new Date();
	
		const elapsedHours = (now.getTime() - checkin.getTime()) / (1000 * 60 * 60);
	
		return elapsedHours >= dailyLimit;
	};

	const handleCheckout = async (attendance_id: number) => {
		checkout(attendance_id, {
			onSuccess: (data) => {
				toast.success(data.message);
			}
		})
	};

	const formatPhilippineTime = (date: string | null) => {
		if (!date) return "--";

		return new Intl.DateTimeFormat("en-PH", {
			timeZone: "Asia/Manila",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true,
		}).format(new Date(date));
	};
	
	const TH_CLASS = "text-left text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold px-5 py-4"

	return (
		<Card className="rounded-2xl shadow-sm overflow-hidden p-0">
			<CardContent className="p-0">
				<Table className="text-sm">
					<TableHeader>
						<TableRow className="hover:bg-transparent bg-slate-50/70 dark:bg-stone-900/50">
							<TableHead className={TH_CLASS}>Name</TableHead>
							<TableHead className={TH_CLASS}>Plan</TableHead>
							<TableHead className={TH_CLASS}>Daily Limit</TableHead>
							<TableHead className={TH_CLASS}>Check-in</TableHead>
							<TableHead className={TH_CLASS}>Check-out</TableHead>
							<TableHead className={TH_CLASS}>Status</TableHead>
							<TableHead className={TH_CLASS}>Action</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{isLoading ? (
							<TableLoader />
						) : members.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className="text-center py-10 text-slate-400"
								>
									No attendance found
								</TableCell>
							</TableRow>
						) : (
							members.map((m, index) => (
								<TableRow key={index} className="hover:bg-slate-50 transition">
									<TableCell className="px-5 py-4">
										<div className="flex items-center gap-3">
											<Avatar className="w-9 h-9 bg-emerald-100">
												<AvatarFallback  className="bg-[#963348] text-xs font-semibold text-white dark:bg-[#7A1F31]">
													{getInitials(m.name)}
												</AvatarFallback>
											</Avatar>

											<span className="font-medium text-slate-700">
												{m.name}
											</span>
										</div>
									</TableCell>

									<TableCell className="px-5 py-4">
										<Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
										{m.plan ?? "No Plan"}
										</Badge>
									</TableCell>
									
									<TableCell className="px-5 py-4 text-slate-600">
										{m.daily_limit ?? 0} hrs
									</TableCell>
									
									<TableCell className="px-5 py-4 text-slate-600">
										{formatPhilippineTime(m.checkin_time)}
									</TableCell>
									
									<TableCell className="px-5 py-4 text-slate-600">
										{formatPhilippineTime(m.checkout_time)}
									</TableCell>

									<TableCell className="px-5 py-4">
										<Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
										{m.status}
										</Badge>
									</TableCell>

									<TableCell className="px-2 py-4">
										{m.status === "CHECK_IN" && canCheckout(m.checkin_time, m.daily_limit) ? (
											<Button
												size="sm"
												variant="ghost"
												title="Mark checkout"
												className="h-8 gap-2 rounded-lg px-3 bg-red-500 text-white hover:bg-red-600 hover:text-white"
												onClick={() => handleCheckout(m.attendance_id)}
												disabled={isPending}
											>
												{isPending ? (
													<LoaderCircle className="h-4 w-4 animate-spin" />
												) : (
													<CircleCheck
														size={16}
														strokeWidth={1.8}
													/>
												)}

												<span className="text-xs font-medium">
													{isPending ? "Checking out..." : "Mark Checkout"}
												</span>
											</Button>
										) : (
											<span className="text-xs text-slate-300 dark:text-stone-600">
												No available actions.
											</span>
										)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}