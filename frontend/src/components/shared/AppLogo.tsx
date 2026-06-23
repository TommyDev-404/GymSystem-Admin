import { Dumbbell } from "lucide-react";

export function AppLogo({ collapsed = false, color = "text-white" }: { collapsed?: boolean, color?: string }) {
  return (
    <div className="flex items-center gap-3">
      {/* Icon */}
      <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500">
        <Dumbbell size={18} className="text-white" />
      </div>

      {/* Text (collapsible like sidebar) */}
      <div
        className={`transition-all duration-200 ease-in-out overflow-hidden
        ${collapsed ? "opacity-0 -translate-x-2" : "opacity-100 translate-x-0"}
        `}
      >
        <p className={`${color} font-semibold leading-none`}>JFitness Gym</p>
        <p className="text-slate-400 text-xs mt-0.5">Admin Portal</p>
      </div>
    </div>
  );
}