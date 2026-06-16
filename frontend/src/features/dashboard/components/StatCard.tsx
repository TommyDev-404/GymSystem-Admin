// components/StatCard.tsx

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { HOVER_EFFECT } from "@/utils/animations";

type StatCardProps = {
  title: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  trend?: string;
  trendUp?: boolean;
  color: string;
};

export function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  trend,
  trendUp,
  color,
}: StatCardProps) {
  return (
    <Card className={HOVER_EFFECT}>
      <CardContent>
        <div className="flex items-start justify-between">
          {/* Left content */}
          <div>
            <p className="text-slate-500 text-sm">{title}</p>

            <p className="text-2xl font-semibold text-slate-800 mt-1">
              {value}
            </p>

            {sub && (
              <p className="text-slate-400 text-xs mt-0.5">{sub}</p>
            )}
          </div>

          {/* Icon */}
          <div className={`p-2.5 rounded-xl ${color}`}>
            <Icon size={20} className="text-white" />
          </div>
        </div>

        {/* Trend */}
        {trend && (
          <div
            className={`flex items-center gap-1 mt-3 text-xs font-medium ${
              trendUp ? "text-emerald-600" : "text-red-500"
            }`}
          >
            {trendUp ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}

            <span>{trend}</span>

            <span className="text-slate-400 font-normal ml-1">
              vs last month
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}