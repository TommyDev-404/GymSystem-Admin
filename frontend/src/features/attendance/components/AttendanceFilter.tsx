import { CalendarDays } from "lucide-react";
import { useState } from "react";
import type { Filters } from "../types/AttendanceTypes";

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

export function AttendanceFilter({ filters, setFilters }: Props) {
  const currentYear = new Date().getFullYear();

  const [disableDayFilter, setDisableDayFilter] = useState(
    filters.day === undefined ? true : false
  );

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  const updateFilter = (key: keyof Filters, value: number) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleToggle = (checked: boolean) => {
    // checked = true means "All days" is ON, so day filter is disabled
    setDisableDayFilter(checked);

    setFilters((prev) => ({
      ...prev,
      day: checked ? undefined : new Date().getDate(),
    }));
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="px-5 py-2">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* MONTH */}
          <FilterSelect
            label="Month"
            value={filters.month}
            options={months.map((m, i) => ({
              value: i + 1,
              label: m,
            }))}
            onChange={(v) => updateFilter("month", v)}
          />

          {/* YEAR */}
          <FilterSelect
            label="Year"
            value={filters.year}
            options={years.map((y) => ({
              value: y,
              label: y.toString(),
            }))}
            onChange={(v) => updateFilter("year", v)}
          />

          {/* DAY */}
          <FilterSelect
            label="Day"
            value={filters.day}
            disabled={disableDayFilter}
            options={days.map((d) => ({
              value: d,
              label: d.toString(),
            }))}
            onChange={(v) => updateFilter("day", v)}
          />

          {/* TOGGLE */}
          <div className="flex items-end">
            <div className="flex items-center gap-3">
              <Switch
                checked={disableDayFilter}
                onCheckedChange={handleToggle}
                className="data-[state=checked]:bg-emerald-500 data-[state=unchecked]:bg-slate-300"
              />
              <Label className="text-sm text-slate-600 font-normal cursor-pointer">
                All days
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value?: number;
  options: {
    value: number;
    label: string;
  }[];
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-slate-500 flex items-center gap-1">
        <CalendarDays size={13} />
        {label}
      </Label>

      <Select
        disabled={disabled}
        value={value !== undefined ? String(value) : undefined}
        onValueChange={(v) => onChange(Number(v))}
      >
        <SelectTrigger className="w-full rounded-xl bg-slate-50 text-sm text-slate-700 focus:ring-2 focus:ring-emerald-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((item) => (
            <SelectItem key={item.value} value={String(item.value)}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}