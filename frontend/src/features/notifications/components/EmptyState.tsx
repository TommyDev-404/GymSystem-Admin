import { BellOff } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
}

export function EmptyState({
  title = "No notifications",
  message = "There are no notifications available yet.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[300px]">
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        <BellOff className="w-8 h-8 text-slate-400" />
      </div>

      <h3 className="text-slate-700 font-semibold text-base">
        {title}
      </h3>

      <p className="text-slate-400 text-sm mt-1 max-w-sm">
        {message}
      </p>
    </div>
  );
}