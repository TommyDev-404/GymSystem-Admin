import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  filterStatus: string;
  setFilterStatus: (value: string) => void;
}

export function PaymentFilters({
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
}: Props) {
  const statuses = [
    "All",
    "Paid",
    "Pending",
    "Overdue",
  ];

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">

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
            border-slate-200
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
            onClick={() => setFilterStatus(status)}
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
                  ? "border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white"
                  : "border-slate-200 text-slate-600 hover:bg-slate-50"
              }
            `}
          >
            {status}
          </Button>
        ))}
      </div>
    </div>
  );
}