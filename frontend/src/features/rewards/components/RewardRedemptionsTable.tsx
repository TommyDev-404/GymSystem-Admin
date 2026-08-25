import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { formatPhilippineDate } from "@/utils/phTimeFormatter";
import type { RewardRedemption } from "../types/RewardsType";
import {
  useUpdateRewardRedemptionsStatus,
} from "../hook/useRewards";

type Props = {
  redemptions: RewardRedemption[];
  isLoading: boolean;
};

const TH_CLASS =
  "px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500";

const statusStyles: Record<string, string> = {
  Claimed:
    "bg-[#963348]/10 text-[#963348] hover:bg-[#963348]/10 dark:bg-[#963348]/20 dark:text-[#C45A6D]",
  Pending:
    "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-400",
  Cancelled:
    "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-400",
};

export function RewardRedemptionsTable({
  redemptions,
  isLoading,
}: Props) {
  const { mutate: updateStatus, isPending } =
    useUpdateRewardRedemptionsStatus();

  const handleStatusUpdate = (
    redemptionId: number,
    status: string
  ) => {
    updateStatus(
      {
        redemption_id: redemptionId,
        status,
      },
      {
        onSuccess: (data) => {
          toast.success(data.message);
        },
      }
    );
  };

  return (
    <Card className="overflow-hidden rounded-2xl p-0 shadow-sm">
      <CardContent className="p-0">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="bg-slate-50/70 hover:bg-transparent dark:bg-stone-900/50">
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
                  colSpan={6}
                  className="py-10 text-center text-slate-400"
                >
                  No redeemed rewards found
                </TableCell>
              </TableRow>
            ) : (
              redemptions.map((item) => (
                <TableRow
                  key={item.id}
                  className="transition hover:bg-slate-50 dark:hover:bg-slate-800/50"
                >
                  <TableCell className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarFallback className="bg-[#963348] text-white text-xs font-semibold">
                          {getInitials(item.member_name)}
                        </AvatarFallback>
                      </Avatar>

                      <span className="font-medium text-slate-700 dark:text-slate-200">
                        {item.member_name}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    {item.reward_name}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <Badge className="bg-[#963348]/10 text-[#963348] hover:bg-[#963348]/10 dark:bg-[#963348]/20 dark:text-[#C45A6D]">
                      {item.points_used} pts
                    </Badge>
                  </TableCell>

                  <TableCell className="px-5 py-4 text-slate-600 dark:text-slate-300">
                    {formatPhilippineDate(item.redeemed_at)}
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    <Badge
                      className={
                        statusStyles[item.status] ??
                        "bg-slate-100 text-slate-700 hover:bg-slate-100"
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-5 py-4">
                    {item.status === "Pending" && (
                      <div className="flex items-center gap-2">
                        {isPending ? (
                          <LoaderCircle className="h-4 w-4 animate-spin text-[#963348]" />
                        ) : (
                          <Button
                            size="sm"
                            className="bg-[#963348] text-white hover:bg-[#7A1F31]"
                            onClick={() =>
                              handleStatusUpdate(item.id, "Claimed")
                            }
                          >
                            Mark Claimed
                          </Button>
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