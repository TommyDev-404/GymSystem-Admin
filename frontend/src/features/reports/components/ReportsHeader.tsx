import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ReportsHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-slate-800 font-bold text-xl">Reports</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Generate and export detailed reports
        </p>
      </div>

      <Button variant="outline" className="rounded-xl">
        <Download size={14} />
        Export CSV
      </Button>
    </div>
  );
}