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
    <div className="flex min-h-[300px] flex-col items-center justify-center px-6 text-center">
      <div
        className="
          flex
          h-20
          w-20
          items-center
          justify-center
          rounded-full
          border
          border-slate-200
          dark:border-stone-700
          bg-slate-50
          dark:bg-stone-800
          shadow-sm
        "
      >
        <BellOff
          className="
            h-9
            w-9
            text-slate-400
            dark:text-slate-500
          "
        />
      </div>

      <h3
        className="
          mt-5
          text-lg
          font-semibold
          text-slate-800
          dark:text-slate-100
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          max-w-sm
          text-sm
          leading-6
          text-slate-500
          dark:text-slate-400
        "
      >
        {message}
      </p>
    </div>
  );
}