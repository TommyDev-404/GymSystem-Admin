import { Search } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PaymentType } from "../types/PaymentTypes";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  paymentType: PaymentType;
  setPaymentType: (value: PaymentType) => void;
  month: string;
  setMonth: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
}

const months = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 5 }, (_, index) =>
  String(currentYear - index),
);

export function PaymentFilters({
  search,
  setSearch,
  paymentType,
  setPaymentType,
  month,
  setMonth,
  year,
  setYear,
}: Props) {
  return (
    <Card className="rounded-2xl border-slate-200 shadow-sm dark:border-stone-800">
      <CardContent className="flex flex-wrap items-center gap-3 p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <Input
            placeholder="Search member..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-10 rounded-xl border-slate-200 bg-slate-50 pl-9 text-sm text-slate-700 focus-visible:ring-2 focus-visible:ring-emerald-400 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200"
          />
        </div>

        <Select
          value={paymentType}
          onValueChange={setPaymentType}
        >
          <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white text-sm font-medium text-slate-600 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-300 sm:w-[170px]">
            <SelectValue placeholder="Payment type" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="All">All types</SelectItem>
            <SelectItem value="Membership">Membership</SelectItem>
            <SelectItem value="Renewal">Renewal</SelectItem>
            <SelectItem value="Upgrade">Upgrade</SelectItem>
          </SelectContent>
        </Select>

        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white text-sm font-medium text-slate-600 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-300 sm:w-[150px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>

          <SelectContent>
            {months.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="h-10 w-full rounded-xl border-slate-200 bg-white text-sm font-medium text-slate-600 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-300 sm:w-[110px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>

          <SelectContent>
            {years.map((item) => (
              <SelectItem key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}