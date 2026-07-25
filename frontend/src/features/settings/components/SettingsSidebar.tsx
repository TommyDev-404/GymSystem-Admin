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
  setActive: (v: string) => void;
}) {
  return (
    <div className="w-48 space-y-1">
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => setActive(s.id)}
          className={`
            w-full
            flex
            items-center
            gap-3
            rounded-xl
            px-3.5
            py-2.5
            text-sm
            transition-colors

            ${
              active === s.id
                ? "bg-emerald-500 text-white"
                : `
                  text-slate-600
                  dark:text-slate-300
                  hover:bg-white
                  dark:hover:bg-stone-800
                  hover:shadow-sm
                  dark:hover:shadow-none
                `
            }
          `}
        >
          <s.icon size={15} />
          <span>{s.label}</span>
        </button>
      ))}
    </div>
  );
}