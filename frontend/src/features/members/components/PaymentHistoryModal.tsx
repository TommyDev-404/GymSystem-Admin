import { useMemo, useState } from "react";
import {
  CalendarDays,
  CreditCard,
  History,
  ReceiptText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useGetMemberPaymentHistory } from "../hooks/useMember";
import type { PaymentHistoryFilters } from "../types/member";

type Payment = {
  id: number;
  amount: number;
  paymentMethod: string;
  startDate: string | null;
  endDate: string | null;
  type: string;
  status: string;
  paidAt: string | null;
  duration: number;
  duration_type: string;
  plan: string;
};

type PaymentHistoryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  memberId: number;
  name: string;
  email: string;
};

const paymentTypeConfig = {
  Membership: {
    label: "Membership",
    className:
      "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-900/30 dark:text-blue-300",
  },
  Renewal: {
    label: "Renewal",
    className:
      "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  Upgrade: {
    label: "Upgrade",
    className:
      "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-900/30 dark:text-violet-300",
  },
} as const;

const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

const dateFormatter = new Intl.DateTimeFormat("en-PH", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const statusStyles: Record<Payment["status"], string> = {
  Paid: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",
  Pending:
    "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
  Failed:
    "border-red-200 bg-red-50 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-400",
  Refunded:
    "border-slate-200 bg-slate-100 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400",
};

const getPaymentTypeConfig = (type: string) =>
  paymentTypeConfig[type as keyof typeof paymentTypeConfig] ?? {
    label: type || "Other",
    className: "border-border bg-muted text-muted-foreground",
  };

const formatDate = (date: string | null) => {
  if (!date) return "Not available";

  const parsedDate = new Date(date);

  return Number.isNaN(parsedDate.getTime())
    ? "Not available"
    : dateFormatter.format(parsedDate);
};

export function PaymentHistoryModal({
  open,
  onOpenChange,
  memberId,
  name,
  email,
}: PaymentHistoryDialogProps) {
  const now = new Date();

  const [month, setMonth] = useState(String(now.getMonth() + 1));
  const [year, setYear] = useState(String(now.getFullYear()));

  const filters: PaymentHistoryFilters = {
    month: Number(month),
    year: Number(year),
  };

  const {
    data: paymentHistory = [],
    isLoading,
    isError,
  } = useGetMemberPaymentHistory(memberId, filters);

  const payments: Payment[] = paymentHistory;

  const successfulPayments = useMemo(
    () => payments.filter((payment) => payment.status === "Paid"),
    [payments],
  );

  const totalPaid = useMemo(
    () =>
      successfulPayments.reduce(
        (total, payment) => total + payment.amount,
        0,
      ),
    [successfulPayments],
  );

  const latestPayment = useMemo(
    () =>
      [...successfulPayments].sort(
        (a, b) =>
          new Date(b.paidAt ?? 0).getTime() -
          new Date(a.paidAt ?? 0).getTime(),
      )[0],
    [successfulPayments],
  );

  const sortedPayments = useMemo(
    () =>
      [...payments].sort(
        (a, b) =>
          new Date(b.paidAt ?? 0).getTime() -
          new Date(a.paidAt ?? 0).getTime(),
      ),
    [payments],
  );

  const selectedPeriod = new Date(
    Number(year),
    Number(month) - 1,
  ).toLocaleString("en-PH", {
    month: "long",
    year: "numeric",
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!left-1/2 !top-1/2 !w-[calc(100vw-2rem)] !max-w-6xl !-translate-x-1/2 !-translate-y-1/2 flex h-[90dvh] flex-col gap-0 overflow-hidden p-0">
        <DialogHeader className="shrink-0 p-6 pb-5">
          <div className="flex items-start gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border bg-muted/50">
              <History className="size-5 text-muted-foreground" />
            </div>

            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xl">
                Payment History
              </DialogTitle>

              <DialogDescription className="mt-1">
                View payment transactions and subscription details.
              </DialogDescription>

              <p className="mt-2 truncate text-sm text-muted-foreground">
                {name} · {email}
              </p>
            </div>
          </div>
        </DialogHeader>

        <Separator />

        <div className="grid shrink-0 grid-cols-1 gap-3 p-6 pb-4 sm:grid-cols-3">
          <div className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">
              Total successfully paid
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {currencyFormatter.format(totalPaid)}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {successfulPayments.length} successful{" "}
              {successfulPayments.length === 1 ? "payment" : "payments"}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">
              Total transactions
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {payments.length}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {selectedPeriod}
            </p>
          </div>

          <div className="rounded-xl border p-4">
            <p className="text-sm text-muted-foreground">
              Latest successful payment
            </p>

            <p className="mt-2 text-2xl font-semibold tracking-tight">
              {latestPayment
                ? currencyFormatter.format(latestPayment.amount)
                : "—"}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {latestPayment
                ? formatDate(latestPayment.paidAt)
                : "No successful payments"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-3 px-6 pb-4 sm:flex-row sm:items-center">
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger className="w-full sm:w-[170px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>

            <SelectContent>
              {Array.from({ length: 12 }, (_, index) => (
                <SelectItem key={index + 1} value={String(index + 1)}>
                  {new Date(2000, index, 1).toLocaleString("en-PH", {
                    month: "long",
                  })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year} onValueChange={setYear}>
            <SelectTrigger className="w-full sm:w-[120px]">
              <SelectValue placeholder="Select year" />
            </SelectTrigger>

            <SelectContent>
              {Array.from(
                { length: 6 },
                (_, index) => now.getFullYear() - index,
              ).map((yearOption) => (
                <SelectItem key={yearOption} value={String(yearOption)}>
                  {yearOption}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="min-h-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full w-full">
            <div className="space-y-3 p-6 pt-4">
              {isLoading ? (
                <div className="flex min-h-48 items-center justify-center text-sm text-muted-foreground">
                  Loading payment history...
                </div>
              ) : isError ? (
                <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 text-center">
                  <History className="size-9 text-muted-foreground/50" />

                  <p className="font-medium">
                    Unable to load payment history
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Please try again later.
                  </p>
                </div>
              ) : sortedPayments.length > 0 ? (
                sortedPayments.map((payment) => {
                  const typeConfig = getPaymentTypeConfig(payment.type);

                  return (
                    <div
                      key={payment.id}
                      className="rounded-xl border p-4 transition-colors hover:bg-muted/30 sm:p-5"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                          <ReceiptText className="size-5 text-muted-foreground" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold">
                                  {payment.plan}
                                </p>

                                <Badge
                                  variant="secondary"
                                  className={`rounded-md px-2 py-0.5 text-xs font-medium ${typeConfig.className}`}
                                >
                                  {typeConfig.label}
                                </Badge>
                              </div>

                              <p className="mt-1 text-sm text-muted-foreground">
                                {payment.duration}{" "}
                                {payment.duration_type.toLowerCase()}
                                {payment.duration > 1 ? "s" : ""} subscription
                              </p>
                            </div>

                            <div className="sm:text-right">
                              <p className="text-lg font-semibold tracking-tight tabular-nums">
                                {currencyFormatter.format(payment.amount)}
                              </p>

                              <Badge
                                variant="outline"
                                className={`mt-1 ${statusStyles[payment.status]}`}
                              >
                                {payment.status}
                              </Badge>
                            </div>
                          </div>

                          <Separator className="my-4" />

                          <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
                            <div className="flex items-start gap-2">
                              <CreditCard className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                              <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">
                                  Payment method
                                </p>

                                <p className="mt-1 font-medium">
                                  {payment.paymentMethod || "Not specified"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                              <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">
                                  Paid on
                                </p>

                                <p className="mt-1 font-medium">
                                  {formatDate(payment.paidAt)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                              <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">
                                  Subscription start
                                </p>

                                <p className="mt-1 font-medium">
                                  {formatDate(payment.startDate)}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-start gap-2">
                              <CalendarDays className="mt-0.5 size-4 shrink-0 text-muted-foreground" />

                              <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">
                                  Subscription end
                                </p>

                                <p className="mt-1 font-medium">
                                  {formatDate(payment.endDate)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex min-h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 text-center">
                  <History className="size-9 text-muted-foreground/50" />

                  <p className="font-medium">No payments found</p>

                  <p className="text-sm text-muted-foreground">
                    No transactions were found for {selectedPeriod}.
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <Separator />

        <div className="flex shrink-0 items-center justify-between gap-3 px-6 py-4">
          <p className="text-xs text-muted-foreground">
            Showing {sortedPayments.length}{" "}
            {sortedPayments.length === 1 ? "transaction" : "transactions"}
          </p>

          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}