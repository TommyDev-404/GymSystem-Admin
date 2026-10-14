import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import type { PaymentFiltersType } from "@/features/payments/types/PaymentTypes";
import { getInitials } from "@/utils/initials";
import { TableLoader } from "@/components/shared/TableLoader";
import { usePayments } from "../hooks/usePayments";
import {
  CheckCircle2,
  Clock3,
  XCircle,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Props {
  params: PaymentFiltersType;
}

const PAGE_SIZE = 10;

const TH_CLASS = "px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500";
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

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("en-PH", {
  hour: "numeric",
  minute: "2-digit",
});

export function PaymentsTable({ params }: Props) {
  const { data: payments = [], isLoading } = usePayments(params);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(payments.length / PAGE_SIZE));
  const activePage = Math.min(currentPage, totalPages);
  const startIndex = (activePage - 1) * PAGE_SIZE;
  const paginatedPayments = payments.slice(
    startIndex,
    startIndex + PAGE_SIZE,
  );

  return (
    <Card className="overflow-hidden rounded-2xl p-0 shadow-sm">
      <CardContent className="p-0">
        <Table className="text-sm">
          <TableHeader>
            <TableRow className="bg-slate-50/70 hover:bg-transparent dark:bg-stone-900/50">
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
            ) : paginatedPayments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-14 text-center text-slate-400 dark:text-slate-500"
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
              paginatedPayments.map((p) => {
                const status =
                  statusConfig[p.status as keyof typeof statusConfig];
                const paymentType =
                  paymentTypeConfig[
                    p.paymentType as keyof typeof paymentTypeConfig
                  ];

                const paidDate = p.paidDate
                  ? new Date(p.paidDate)
                  : null;

                const isValidPaidDate =
                  paidDate && !Number.isNaN(paidDate.getTime());

                return (
                  <TableRow
                    key={p.id}
                    className="group border-slate-100 transition-colors hover:bg-slate-50/70 dark:border-stone-800 dark:hover:bg-stone-800/50"
                  >
                    <TableCell className={TD_CLASS}>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 shrink-0">
                          <AvatarFallback className="bg-[#963348] text-xs font-semibold text-white dark:bg-[#7A1F31]">
                            {getInitials(p.memberName)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-700 dark:text-slate-100">
                            {p.memberName}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            Payment #{p.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className={TD_CLASS}>
                      <Badge className="border-0 bg-indigo-50 font-medium text-indigo-700 hover:bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/30">
                        {p.plan}
                      </Badge>
                    </TableCell>

                    <TableCell className={TD_CLASS}>
                      {paymentType ? (
                        <Badge
                          className={`${paymentType.className} border-0 font-medium hover:opacity-100`}
                        >
                          {paymentType.label}
                        </Badge>
                      ) : (
                        <span className="text-slate-400">
                          {p.paymentType || "-"}
                        </span>
                      )}
                    </TableCell>

                    <TableCell
                      className={`${TD_CLASS} font-semibold text-slate-700 dark:text-slate-100`}
                    >
                      {currencyFormatter.format(Number(p.amount))}
                    </TableCell>

                    <TableCell
                      className={`${TD_CLASS} text-slate-500 dark:text-slate-400`}
                    >
                      {p.paymentMethod ?? "-"}
                    </TableCell>

                    <TableCell className={TD_CLASS}>
                      {status ? (
                        <Badge
                          className={`gap-1.5 border font-medium hover:bg-inherit ${status.color}`}
                        >
                          <status.icon className="h-3 w-3" />
                          {p.status}
                        </Badge>
                      ) : (
                        <Badge variant="outline">{p.status || "Unknown"}</Badge>
                      )}
                    </TableCell>

                    <TableCell
                      className={`${TD_CLASS} text-slate-500 dark:text-slate-400`}
                    >
                      {isValidPaidDate ? (
                        <div>
                          <p className="font-medium text-slate-600 dark:text-slate-300">
                            {dateFormatter.format(paidDate)}
                          </p>
                          <p className="text-xs text-slate-400 dark:text-slate-500">
                            {timeFormatter.format(paidDate)}
                          </p>
                        </div>
                      ) : (
                        <Badge className="border-0 bg-slate-100 text-slate-400 dark:bg-stone-800 dark:text-slate-500">
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

        {!isLoading && payments.length > 0 && (
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 dark:border-stone-800 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
                <span className="min-w-[90px] text-center text-xs text-slate-500 dark:text-slate-400">
                  Page {activePage} of {totalPages}
                </span>
            </p>

            {payments.length > PAGE_SIZE && (
              <div className="flex items-center justify-between gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 rounded-lg px-3"
                  disabled={activePage === 1}
                  onClick={() =>
                    setCurrentPage((page) => Math.max(1, page - 1))
                  }
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1 rounded-lg px-3"
                  disabled={activePage === totalPages}
                  onClick={() =>
                    setCurrentPage((page) =>
                      Math.min(totalPages, page + 1),
                    )
                  }
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}