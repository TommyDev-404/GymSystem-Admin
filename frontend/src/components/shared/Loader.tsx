import { LoaderCircle } from "lucide-react";

export function Loader() {
  return (
    <div className="flex min-h-[300px] flex-col items-center justify-center gap-3">
      <LoaderCircle
        className="h-8 w-8 text-emerald-500 animate-spin"
      />

      <p className="text-sm font-medium text-slate-500">
        Fetching data...
      </p>
    </div>
  );
}