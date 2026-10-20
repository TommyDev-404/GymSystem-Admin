import { memo, useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import type { Attendance } from "../types/AttendanceTypes";
import { getInitials } from "@/utils/initials";
import { TableLoader } from "@/components/shared/TableLoader";
import { useCheckoutMember } from "../hooks/useAttendance";

type Props = {
  members: Attendance[];
  isLoading: boolean;
};

type SessionType = "MORNING" | "AFTERNOON";

type SessionTimeCellProps = {
  checkInTime: string | null;
  checkOutTime: string | null;
};

function parseTimestamp(date: string | null | undefined): number | null {
  if (!date) return null;

  const timestamp = new Date(date).getTime();

  return Number.isFinite(timestamp) ? timestamp : null;
}

function formatPhilippineTime(
  date: string | null | undefined,
): string {
  if (!date) return "--";

  const timestamp = new Date(date);

  if (!Number.isFinite(timestamp.getTime())) return "--";

  return new Intl.DateTimeFormat("en-PH", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(timestamp);
}

const RemainingTime = memo(function RemainingTime({
  member,
}: {
  member: Attendance;
}) {
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const morningIn = parseTimestamp(member.morning_checkin_time);
  const morningOut = parseTimestamp(member.morning_checkout_time);
  const afternoonIn = parseTimestamp(member.afternoon_checkin_time);
  const afternoonOut = parseTimestamp(member.afternoon_checkout_time);

  const hasCheckIn = morningIn !== null || afternoonIn !== null;

  const hasActiveSession =
    (morningIn !== null && morningOut === null) ||
    (afternoonIn !== null && afternoonOut === null);

  useEffect(() => {
    if (!hasActiveSession) return;

    const updateTime = () => {
      setCurrentTime(Date.now());
    };

    updateTime();

    const interval = window.setInterval(updateTime, 1000);

    return () => window.clearInterval(interval);
  }, [hasActiveSession]);

  if (!hasCheckIn) {
    return <span className="text-slate-400">--</span>;
  }

  if (afternoonOut !== null) {
    return (
      <span className="font-mono text-xs font-medium tabular-nums text-slate-500">
        0h 0m 0s
      </span>
    );
  }

  if (member.daily_limit == null) {
    return <span className="text-xs text-slate-500">Unlimited</span>;
  }

  const dailyLimit = Number(member.daily_limit);

  if (!Number.isFinite(dailyLimit) || dailyLimit < 0) {
    return <span className="text-slate-400">--</span>;
  }

  if (dailyLimit === 0) {
    return <span className="text-xs text-slate-500">Unlimited</span>;
  }

  const getElapsedTime = (
    checkIn: number | null,
    checkOut: number | null,
  ) => {
    if (checkIn === null) return 0;

    const endTime = checkOut ?? currentTime;

    return Math.max(0, endTime - checkIn);
  };

  const morningElapsed = getElapsedTime(morningIn, morningOut);
  const afternoonElapsed = getElapsedTime(afternoonIn, afternoonOut);

  const totalElapsed = morningElapsed + afternoonElapsed;
  const totalAllowed = dailyLimit * 60 * 60 * 1000;
  const remainingMs = Math.max(0, totalAllowed - totalElapsed);

  const hours = Math.floor(remainingMs / 3_600_000);
  const minutes = Math.floor((remainingMs % 3_600_000) / 60_000);
  const seconds = Math.floor((remainingMs % 60_000) / 1000);

  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-2 w-2 shrink-0 rounded-full ${
          hasActiveSession
            ? "bg-emerald-500"
            : "bg-slate-300 dark:bg-slate-600"
        }`}
      />

      <span className="whitespace-nowrap font-mono text-xs font-medium tabular-nums text-slate-700 dark:text-slate-200">
        {`${hours}h ${minutes}m ${seconds}s`}
      </span>
    </div>
  );
});

function SessionTimeCell({
  checkInTime,
  checkOutTime,
}: SessionTimeCellProps) {
  const hasCheckIn = Boolean(checkInTime);
  const hasCheckOut = Boolean(checkOutTime);

  return (
    <div className="min-w-[142px] space-y-2">
      <div className="flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/70 px-2.5 py-2 dark:border-emerald-900/50 dark:bg-emerald-950/20">
        <span className="inline-flex h-6 min-w-9 items-center justify-center rounded-md bg-emerald-100 px-1.5 text-[10px] font-bold tracking-wide text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300">
          IN
        </span>

        <span
          className={`whitespace-nowrap text-xs font-semibold tabular-nums ${
            hasCheckIn
              ? "text-slate-700 dark:text-slate-200"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {formatPhilippineTime(checkInTime)}
        </span>

        <span
          className={`ml-auto h-1.5 w-1.5 shrink-0 rounded-full ${
            hasCheckIn
              ? "bg-emerald-500"
              : "bg-slate-300 dark:bg-slate-600"
          }`}
        />
      </div>

      <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50/70 px-2.5 py-2 dark:border-stone-700 dark:bg-stone-900/50">
        <span
          className={`inline-flex h-6 min-w-9 items-center justify-center rounded-md px-1.5 text-[10px] font-bold tracking-wide ${
            hasCheckOut
              ? "bg-sky-100 text-sky-700 dark:bg-sky-900/50 dark:text-sky-300"
              : "bg-slate-200/70 text-slate-500 dark:bg-stone-800 dark:text-slate-400"
          }`}
        >
          OUT
        </span>

        <span
          className={`whitespace-nowrap text-xs font-semibold tabular-nums ${
            hasCheckOut
              ? "text-slate-700 dark:text-slate-200"
              : "text-slate-400 dark:text-slate-500"
          }`}
        >
          {formatPhilippineTime(checkOutTime)}
        </span>

        <span
          className={`ml-auto h-1.5 w-1.5 shrink-0 rounded-full ${
            hasCheckOut
              ? "bg-sky-500"
              : "bg-slate-300 dark:bg-slate-600"
          }`}
        />
      </div>
    </div>
  );
}

export function AttendanceTable({ members, isLoading }: Props) {
  const { mutate: checkout, isPending } = useCheckoutMember();

  const handleCheckout = (
    attendance_id: number,
    sessionType: SessionType,
  ) => {
    checkout(
      { attendance_id, sessionType },
      {
        onSuccess: (data) => {
          toast.success(data.message);
        },
        onError: () => {
          toast.error("Unable to check out. Please try again.");
        },
      },
    );
  };

  const TH_CLASS =
    "px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500";

  return (
    <Card className="overflow-hidden rounded-2xl p-0 shadow-sm">
      <CardContent className="p-0">
        <TooltipProvider>
          <div className="overflow-x-auto">
            <Table className="text-sm">
              <TableHeader>
                <TableRow className="bg-slate-50/70 hover:bg-transparent dark:bg-stone-900/50">
                  <TableHead className={TH_CLASS}>Name</TableHead>
                  <TableHead className={TH_CLASS}>Plan</TableHead>
                  <TableHead className={TH_CLASS}>Daily Limit</TableHead>
                  <TableHead className={TH_CLASS}>Remaining Time</TableHead>
                  <TableHead className={TH_CLASS}>Morning</TableHead>
                  <TableHead className={TH_CLASS}>Afternoon</TableHead>
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
                      colSpan={8}
                      className="py-10 text-center text-slate-400"
                    >
                      No attendance found
                    </TableCell>
                  </TableRow>
                ) : (
                  members.map((m) => {
                    const hasMorningCheckIn = Boolean(
                      m.morning_checkin_time,
                    );
                    const hasAfternoonCheckIn = Boolean(
                      m.afternoon_checkin_time,
                    );

                    const canCheckoutMorning =
                      hasMorningCheckIn && !m.morning_checkout_time;

                    const canCheckoutAfternoon =
                      hasAfternoonCheckIn && !m.afternoon_checkout_time;

                    const hasActiveSession =
                      canCheckoutMorning || canCheckoutAfternoon;

                    const hasAnyCheckIn =
                      hasMorningCheckIn || hasAfternoonCheckIn;

                    const statusLabel = hasActiveSession
                      ? "CHECK_IN"
                      : hasAnyCheckIn
                        ? "CHECK_OUT"
                        : "NO_CHECK_IN";

                    return (
                      <TableRow
                        key={m.attendance_id}
                        className="transition-colors hover:bg-slate-50 dark:hover:bg-stone-900/40"
                      >
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9 bg-emerald-100">
                              <AvatarFallback className="bg-[#963348] text-xs font-semibold text-white dark:bg-[#7A1F31]">
                                {getInitials(m.name)}
                              </AvatarFallback>
                            </Avatar>

                            <span className="whitespace-nowrap font-medium text-slate-700 dark:text-slate-200">
                              {m.name}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          {m.plan ? (
                            <div className="flex flex-col gap-1">
                              <span className="font-medium text-foreground">
                                {m.plan}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                {m.duration} {m.duration_type}
                              </span>

                              <span className="text-sm font-semibold text-red-600">
                                {new Intl.NumberFormat("en-PH", {
                                  style: "currency",
                                  currency: "PHP",
                                }).format(Number(m.price))}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              No Plan
                            </span>
                          )}
                        </TableCell>

                        <TableCell className="whitespace-nowrap px-5 py-4 text-slate-600 dark:text-slate-300">
                          {m.daily_limit != null &&
                          Number(m.daily_limit) !== 0
                            ? `${m.daily_limit} hrs`
                            : "Unlimited"}
                        </TableCell>

                        <TableCell className="whitespace-nowrap px-5 py-4">
                          <RemainingTime member={m} />
                        </TableCell>

                        <TableCell className="px-5 py-3">
                          <SessionTimeCell
                            checkInTime={m.morning_checkin_time}
                            checkOutTime={m.morning_checkout_time}
                          />
                        </TableCell>

                        <TableCell className="px-5 py-3">
                          <SessionTimeCell
                            checkInTime={m.afternoon_checkin_time}
                            checkOutTime={m.afternoon_checkout_time}
                          />
                        </TableCell>

                        <TableCell className="px-5 py-4">
                          <Badge
                            className={
                              statusLabel === "CHECK_IN"
                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : statusLabel === "CHECK_OUT"
                                  ? "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300"
                                  : "bg-slate-100 text-slate-600 hover:bg-slate-100 dark:bg-stone-800 dark:text-slate-300"
                            }
                          >
                            {statusLabel.replaceAll("_", " ")}
                          </Badge>
                        </TableCell>

                        <TableCell className="px-3 py-4">
                          <div className="flex min-w-[190px] flex-col items-start gap-2">
                            {canCheckoutMorning && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 gap-2 rounded-lg bg-red-500 px-3 text-white hover:bg-red-600 hover:text-white"
                                    onClick={() =>
                                      handleCheckout(
                                        m.attendance_id,
                                        "MORNING",
                                      )
                                    }
                                    disabled={isPending}
                                  >
                                    {isPending ? (
                                      <LoaderCircle className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <CircleCheck size={16} />
                                    )}
                                    Checkout Morning
                                  </Button>
                                </TooltipTrigger>

                                <TooltipContent>
                                  Check out of the morning session
                                </TooltipContent>
                              </Tooltip>
                            )}

                            {canCheckoutAfternoon && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 gap-2 rounded-lg bg-red-500 px-3 text-white hover:bg-red-600 hover:text-white"
                                    onClick={() =>
                                      handleCheckout(
                                        m.attendance_id,
                                        "AFTERNOON",
                                      )
                                    }
                                    disabled={isPending}
                                  >
                                    {isPending ? (
                                      <LoaderCircle className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <CircleCheck size={16} />
                                    )}
                                    Checkout Afternoon
                                  </Button>
                                </TooltipTrigger>

                                <TooltipContent>
                                  Check out of the afternoon session
                                </TooltipContent>
                              </Tooltip>
                            )}

                            {hasMorningCheckIn &&
                              Boolean(m.morning_checkout_time) && (
                                <Badge className="gap-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300">
                                  <CircleCheck size={13} />
                                  Morning completed
                                </Badge>
                              )}

                            {hasAfternoonCheckIn &&
                              Boolean(m.afternoon_checkout_time) && (
                                <Badge className="gap-1.5 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300">
                                  <CircleCheck size={13} />
                                  Afternoon completed
                                </Badge>
                              )}

                            {!hasAnyCheckIn && (
                              <span className="text-xs text-slate-400">
                                No check-in
                              </span>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}