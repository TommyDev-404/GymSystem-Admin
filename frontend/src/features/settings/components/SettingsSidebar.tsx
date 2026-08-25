import { theme } from "@/utils/theme";
import {
  CreditCard,
  Shield,
  User,
} from "lucide-react";

const sections = [
  { id: "profile", label: "Admin Profile", icon: User },
  { id: "pricing", label: "Pricing", icon: CreditCard },
  { id: "security", label: "Security", icon: Shield },
];

export function SettingsSidebar({
  active,
  setActive,
}: {
  active: string;
  setActive: (value: string) => void;
}) {
  return (
    <div className="w-48 space-y-1">
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = active === section.id;

        return (
          <button
            key={section.id}
            onClick={() => setActive(section.id)}
            className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
              isActive
                ? `${theme.gradient} text-white shadow-sm`
                : "text-slate-600 hover:bg-[#8B1E2D]/5 hover:text-[#8B1E2D] dark:text-slate-300 dark:hover:bg-[#8B1E2D]/10 dark:hover:text-[#A92B3D]"
            }`}
          >
            <Icon size={15} />
            <span>{section.label}</span>
          </button>
        );
      })}
    </div>
  );
}