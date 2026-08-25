import type { LucideIcon } from "lucide-react";
import { Button } from "../ui/button";
import { theme } from "@/utils/theme";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  setOpen?: () => void;
  actionName?: string;
}

export default function PageHeader({
  title,
  subtitle,
  icon: Icon,
  setOpen,
  actionName,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          {title}
        </h1>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          {subtitle}
        </p>
      </div>

      {actionName && (
        <Button
          className={`${theme.gradient} px-3 py-5 text-white`}
          onClick={setOpen}
        >
          {Icon && <Icon size={18} />}
          {actionName}
        </Button>
      )}
    </div>
  );
}