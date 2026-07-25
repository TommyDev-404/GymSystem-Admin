import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import type { FilterType } from "../types/payment";

interface Props {
  search: string;
  setSearch: (value: string) => void;
  filterStatus: string;
  setFilterStatus: (value: FilterType) => void;
}

export function PaymentFilters({
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
}: Props) {

  const statuses = [
    "Paid",
    "Pending",
    "Overdue",
  ];

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="flex items-center gap-3 px-4 py-2">

        {/* Search */}
        <div className="relative flex-1 min-w-40">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          />

          <Input
            placeholder="Search member..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              h-10
              rounded-xl
              border-stone-200
              dark:border-stone-700
              bg-slate-50
              pl-9
              text-sm
              text-slate-700
              focus-visible:ring-2
              focus-visible:ring-emerald-400
            "
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-1.5">
          {statuses.map((status) => (
            <Button
              key={status}
              onClick={() => setFilterStatus(status as FilterType)}
              variant="outline"
              className={`
                rounded-xl
                px-3.5
                py-2
                text-sm
                font-medium
                transition-colors
                ${
                  filterStatus === status
                    ? "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white dark:border-emerald-500 dark:bg-emerald-500 dark:text-white dark:hover:bg-emerald-600"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                }
              `}
            >
              {status}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}