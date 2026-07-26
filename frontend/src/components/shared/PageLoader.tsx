interface PageLoaderProps {
  message?: string;
}

export function PageLoader({
  message = "Loading data, please wait...",
}: PageLoaderProps) {
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-slate-50
        dark:bg-stone-950
        transition-colors
        duration-300
      "
    >
      <div className="flex flex-col items-center gap-5">
        {/* Wave Dots */}
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
          <span className="h-3 w-3 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
          <span className="h-3 w-3 rounded-full bg-emerald-500 animate-bounce" />
        </div>

        <p
          className="
            text-sm
            font-medium
            text-slate-600
            dark:text-stone-300
            transition-colors
            duration-300
          "
        >
          {message}
        </p>
      </div>
    </div>
  );
}