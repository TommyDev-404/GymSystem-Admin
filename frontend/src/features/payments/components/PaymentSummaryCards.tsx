import {
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";

import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { HOVER_EFFECT } from "@/utils/animations";

interface Props {
  totalPaid: number;
  totalPending: number;
  totalOverdue: number;
}

export function PaymentSummaryCards({
  totalPaid,
  totalPending,
  totalOverdue,
}: Props) {
  const cards = [
    {
      title: "Total Collected",
      value: `$${totalPaid}`,
      sub: "Paid payments",
      icon: CheckCircle2,
      bg: "bg-emerald-500",
    },
    {
      title: "Pending Amount",
      value: `$${totalPending}`,
      sub: "Members with pending bills",
      icon: Clock,
      bg: "bg-amber-500",
    },
    {
      title: "Overdue Amount",
      value: `$${totalOverdue}`,
      sub: "Members with overdue bills",
      icon: AlertCircle,
      bg: "bg-red-500",
    },
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
            <p className="text-2xl font-semibold text-slate-800">
              {card.value}
            </p>

            {/* Title */}
            <p className="mt-1 text-xs text-slate-500">
              {card.title}
            </p>

            {/* Subtitle */}
            <div className="flex items-center gap-1">
              <p className="text-xs text-slate-400">
                {4}
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