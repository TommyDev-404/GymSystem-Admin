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
import type { Payment } from "@/features/payments/types/payment";
import { statusConfig } from "@/utils/statusConfig";
import { getInitials } from "@/utils/initials";
import { TableLoader } from "@/components/shared/TableLoader";

interface Props {
  payments: Payment[];
  isLoading: boolean;
}

const TH_CLASS ="text-left text-slate-500 dark:text-slate-400 font-medium px-5 py-3.5 h-auto";
const TD_CLASS = "px-5 py-5";

export function PaymentsTable({ payments, isLoading }: Props) {
  return (
    <Card className="rounded-2xl shadow-sm overflow-hidden p-0">
      <CardContent className="p-0">
        <Table className="text-sm">

          {/* HEADER */}
          <TableHeader>
            <TableRow>
              <TableHead className={TH_CLASS}>Member</TableHead>
              <TableHead className={TH_CLASS}>Plan</TableHead>
              <TableHead className={TH_CLASS}>Amount</TableHead>
              <TableHead className={TH_CLASS}>Status</TableHead>
              <TableHead className={TH_CLASS}>Due Date</TableHead>
              <TableHead className={TH_CLASS}>Paid On</TableHead>
            </TableRow>
          </TableHeader>

          {/* BODY */}
          <TableBody>
            {isLoading ? (
              <TableLoader />
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-slate-400 dark:text-slate-500"
                >
                  No payments found.
                </TableCell>
              </TableRow>
            ) : (
              payments.map((p) => {
                const cfg = statusConfig[p.status];

                return (
                  <TableRow
                    key={p.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {/* MEMBER */}
                    <TableCell className={TD_CLASS}>
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9 shrink-0">
                          <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-xs font-semibold">
                            {getInitials(p.memberName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-slate-700 dark:text-slate-100 font-medium">
                          {p.memberName}
                        </span>
                      </div>
                    </TableCell>

                    {/* PLAN */}
                    <TableCell className={TD_CLASS}>
                      <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/40">
                        {p.plan}
                      </Badge>
                    </TableCell>

                    {/* AMOUNT */}
                    <TableCell className={`${TD_CLASS} text-slate-700 dark:text-slate-100 font-medium`}>
                      {new Intl.NumberFormat("en-PH", {
                        style: "currency",
                        currency: "PHP",
                      }).format(p.amount)}
                    </TableCell>

                    {/* STATUS */}
                    <TableCell className={TD_CLASS}>
                      <Badge
                        className={`gap-1.5 border font-medium hover:bg-inherit ${cfg.color}`}
                      >
                        <cfg.icon className="h-3 w-3" />
                        {p.status}
                      </Badge>
                    </TableCell>

                    {/* DUE DATE */}
                    <TableCell className={`${TD_CLASS} text-slate-500 dark:text-slate-400`}>
                      {new Date(p.dueDate).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>

                    {/* PAID DATE */}
                    <TableCell className={`${TD_CLASS} text-slate-500 dark:text-slate-400`}>
                      {p.paidDate ? (
                        new Date(p.paidDate).toLocaleDateString("en-PH", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })
                      ) : (
                        <Badge className="bg-slate-100 text-slate-400 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-500 dark:hover:bg-slate-800 font-medium">
                          Not paid yet
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