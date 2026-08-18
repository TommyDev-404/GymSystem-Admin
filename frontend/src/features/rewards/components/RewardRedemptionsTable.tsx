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

import { TableLoader } from "@/components/shared/TableLoader";
import { getInitials } from "@/utils/initials";

import type { RewardRedemption } from "../types/RewardsType";
import { Button } from "@/components/ui/button";
import { formatPhilippineDate } from "@/utils/phTimeFormatter";
import { useUpdateRewardRedemptionsStatus } from "../hook/useRewards";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";


type Props = {
	redemptions: RewardRedemption[];
	isLoading: boolean;
};


export function RewardRedemptionsTable({ redemptions, isLoading, }: Props) {
	const { mutate: updateStatus, isPending } = useUpdateRewardRedemptionsStatus();
	
	const TH_CLASS = "text-left text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold px-5 py-4" 

	const statusStyle = (status: string) => {
		switch(status){
			case "claimed":
				return "bg-emerald-100 text-emerald-700 hover:bg-emerald-100";

			case "pending":
				return "bg-amber-100 text-amber-700 hover:bg-amber-100";

			case "cancelled":
				return "bg-red-100 text-red-700 hover:bg-red-100";

			default:
				return "bg-slate-100 text-slate-700 hover:bg-slate-100";
		}
	};

	const handleStatusUpdate = (redemption_id: number, status: string) => {
		updateStatus({ redemption_id, status }, {
			onSuccess: (data) => {
				toast.success(data.message);
			}
		})
	};

	return (
		<Card className="rounded-2xl shadow-sm overflow-hidden p-0">
			<CardContent className="p-0">
				<Table className="text-sm">
					<TableHeader>
						<TableRow className="hover:bg-transparent bg-slate-50/70 dark:bg-stone-900/50">
							<TableHead className={TH_CLASS}>Member</TableHead>
							<TableHead className={TH_CLASS}>Reward</TableHead>
							<TableHead className={TH_CLASS}>Points Used</TableHead>
							<TableHead className={TH_CLASS}>Redeemed At</TableHead>
							<TableHead className={TH_CLASS}>Status</TableHead>
							<TableHead className={TH_CLASS}>Actions</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{isLoading ? (
							<TableLoader />
						) : redemptions.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-center py-10 text-slate-400"
								>
									No redeemed rewards found
								</TableCell>
							</TableRow>
						) : (
							redemptions.map((item)=>(
								<TableRow
									key={item.id}
									className="hover:bg-slate-50 transition"
								>
									{/* MEMBER */}
									<TableCell className="px-5 py-4">

										<div className="flex items-center gap-3">

											<Avatar className="w-9 h-9 bg-emerald-100">

											<AvatarFallback
												className="
													bg-emerald-100 
													text-emerald-700 
													text-xs 
													font-semibold 
													uppercase
												"
											>
												{getInitials(item.member_name)}
											</AvatarFallback>

											</Avatar>


											<span className="
											font-medium 
											text-slate-700
											">
											{item.member_name}
											</span>

										</div>

									</TableCell>

									{/* REWARD */}
									<TableCell className="
										px-5 
										py-4 
										text-slate-600
									">
										{item.reward_name}
									</TableCell>

									{/* POINTS */}
									<TableCell className="
										px-5 
										py-4
									">

										<Badge
											className="
											bg-indigo-100 
											text-indigo-700 
											hover:bg-indigo-100
											"
										>
											{item.points_used} pts
										</Badge>

									</TableCell>

									{/* DATE */}
									<TableCell className="
										px-5 
										py-4 
										text-slate-600
									">
										{formatPhilippineDate(item.redeemed_at)}
									</TableCell>

									{/* STATUS */}
									<TableCell className="px-5 py-4">

										<Badge
											className={statusStyle(item.status)}
										>
											{item.status}
										</Badge>

									</TableCell>
									
									{/* ACTIONS */}
									<TableCell className="px-5 py-4">
										{item.status === "Pending" && (
											<div className="flex gap-2">
												{isPending ? (
													<LoaderCircle className="animate-spin text-emerald-500" />
												) : (
													<>
														<Button
															size="sm"
															className="bg-emerald-500 hover:bg-emerald-600 text-white"
															onClick={() => handleStatusUpdate(item.id, "Claimed")}
														>
															Mark Claimed
														</Button>
														
													</>
												)}

												
											</div>
										)}

										{item.status === "Claimed" && (
											<span className="text-sm text-slate-400">
												Completed
											</span>
										)}

										{item.status === "Cancelled" && (
											<span className="text-sm text-red-400">
												Cancelled
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