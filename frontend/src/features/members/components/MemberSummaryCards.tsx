import { Card, CardContent } from "@/components/ui/card";
import { HOVER_EFFECT } from "@/utils/animations";
import {
  CheckCircle2,
  CalendarX,
  UserRoundX,
} from "lucide-react";

type MemberSummary = {
  active: number;
  expiringTomorrow: number;
  expired: number;
  inactiveMembers: number;
};

interface MemberSummaryCardsProps {
  summary: MemberSummary;
}

export function MemberSummaryCards({
  summary,
}: MemberSummaryCardsProps) {
  const cards = [
    {
      title: "Active Memberships",
      value: summary.active,
      description: "Currently active memberships",
      icon: CheckCircle2,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      title: "Expired Memberships",
      value: summary.expired,
      description: "Memberships already expired",
      icon: CalendarX,
      iconColor: "text-rose-600 dark:text-rose-400",
      iconBg: "bg-rose-50 dark:bg-rose-950/40",
    },
    {
      title: "Inactive Members",
      value: summary.inactiveMembers ?? 0,
      description: "No gym visit for 15+ days",
      icon: UserRoundX,
      iconColor: "text-slate-600 dark:text-slate-400",
      iconBg: "bg-slate-100 dark:bg-slate-800/60",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className={`
              ${HOVER_EFFECT}
              border-slate-200
              shadow-sm
              dark:border-slate-800
            `}
          >
            <CardContent className="px-5 py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {card.title}
                  </p>

                  <p className="mt-1 text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
                    {card.value}
                  </p>

                  <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">
                    {card.description}
                  </p>
                </div>

                <div
                  className={`
                    flex h-11 w-11 shrink-0 items-center
                    justify-center rounded-xl
                    ${card.iconBg}
                  `}
                >
                  <Icon
                    className={`h-5 w-5 ${card.iconColor}`}
                    strokeWidth={2}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}