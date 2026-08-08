import {
  CheckCircle2,
  Clock,
  TrendingUp,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { HOVER_EFFECT } from "@/utils/animations";

interface Props {
  totalPaid: string;
  totalPaidAmount:  string;
  totalPending:  string;
  totalPendingAmount:  string;
  monthlyRevenue:  string;
  monthlyPaymentCount: string;
}

export function PaymentSummaryCards({
  totalPaid,
  totalPaidAmount,
  totalPending,
  totalPendingAmount,
  monthlyRevenue,
  monthlyPaymentCount
}: Props) {

  const cards = [
    {
      title: "Total Collected",
      value: totalPaidAmount,
      count: totalPaid,
      sub: "paid payments",
      icon: CheckCircle2,
      bg: "bg-emerald-500",
    },
    {
      title: "Pending Amount",
      value: totalPendingAmount,
      count: totalPending,
      sub: "awaiting payments",
      icon: Clock,
      bg: "bg-amber-500",
    },
    {
      title: "Monthly Revenue",
      value: monthlyRevenue,
      count: monthlyPaymentCount,
      sub: "payments this month",
      icon: TrendingUp,
      bg: "bg-blue-500",
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card) => (
        <Card
          key={card.title}
          className={HOVER_EFFECT}
        >
          <CardContent>
            {/* Icon */}
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${card.bg}`}
            >
              <card.icon className="h-[18px] w-[18px] text-white" />
            </div>

            {/* Amount */}
            <p className="text-2xl font-semibold text-slate-800 dark:text-white">
              {card.value}
            </p>

            {/* Title */}
            <p className="mt-1 text-xs text-slate-500">
              {card.title}
            </p>

            {/* Subtitle */}
            <div className="flex items-center gap-1">
              <p className="text-xs text-slate-400">
                {card.count}
              </p>
              <p className="text-xs text-slate-400">
                {card.sub}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}