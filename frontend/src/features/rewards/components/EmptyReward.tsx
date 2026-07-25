import { Gift } from "lucide-react";

export function EmptyReward() {
  return (
    <div
      className="
        col-span-full
        flex
        h-full
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-slate-200
        dark:border-stone-700
        bg-slate-50
        dark:bg-stone-900/50
        px-6
        text-center
      "
    >
      <div
        className="
          mb-4
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-full
          bg-slate-100
          dark:bg-stone-800
        "
      >
        <Gift className="h-7 w-7 text-muted-foreground" />
      </div>

      <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
        No rewards available
      </h3>

      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        There are currently no rewards to claim. Check back later for new
        offers and benefits.
      </p>
    </div>
  );
}