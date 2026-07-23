import { LoaderCircle } from "lucide-react";

export function TableLoader({
  colSpan = 7,
}: {
  colSpan?: number;
}) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-4 py-12">
        <div className="flex flex-col items-center justify-center gap-3">
          <LoaderCircle
            className="h-8 w-8 text-emerald-500 animate-spin"
          />

          <p className="text-sm font-medium text-slate-500">
            Fetching data...
          </p>
        </div>
      </td>
    </tr>
  );
}