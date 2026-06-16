// AnalyticsKpiCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import { HOVER_EFFECT } from "@/utils/animations";

interface Props {
  kpis: {
    label: string;
    value: string;
    change: string;
    icon: any;
    color: string;
  }[];
}

export function AnalyticsKpiCards({ kpis }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {kpis.map((k) => (
        <Card key={k.label} className={HOVER_EFFECT}>
          <CardContent>
            <div className={`w-10 h-10 ${k.color} rounded-xl flex items-center justify-center mb-3`}>
              <k.icon size={18} className="text-white" />
            </div>

            <p className="text-2xl font-semibold text-slate-800">{k.value}</p>
            <p className="text-slate-500 text-xs mt-0.5">{k.label}</p>
            <p className="text-emerald-600 text-xs font-medium mt-1">
              {k.change} vs last year
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}