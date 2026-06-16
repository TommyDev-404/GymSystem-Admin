import { Button } from "@/components/ui/button";
import { Calendar, FileText } from "lucide-react";

const reportTypes = ["Attendance", "Payments", "Members"] as const;

interface Props {
  activeReport: string;
  setActiveReport: (v: string) => void;
  dateFrom: string;
  dateTo: string;
  setDateFrom: (v: string) => void;
  setDateTo: (v: string) => void;
}

export function ReportsControls({
  activeReport,
  setActiveReport,
  dateFrom,
  dateTo,
  setDateFrom,
  setDateTo,
}: Props) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center gap-3">
      <div className="flex gap-1.5">
        {reportTypes.map((r) => (
          <Button
            key={r}
            onClick={() => setActiveReport(r)}
            variant={activeReport === r ? "default" : "outline"}
            className={`rounded-xl ${
              activeReport === r ? "bg-emerald-500 hover:bg-emerald-600" : ""
            }`}
          >
            <FileText size={13} />
            {r}
          </Button>
        ))}
      </div>

      <div className="flex items-center gap-2 ml-auto">
        <Calendar size={14} className="text-slate-400" />

        <input
          type="date"
          className="border rounded-xl px-3 py-2 text-sm"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />

        <span className="text-slate-400 text-sm">to</span>

        <input
          type="date"
          className="border rounded-xl px-3 py-2 text-sm"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>
    </div>
  );
}