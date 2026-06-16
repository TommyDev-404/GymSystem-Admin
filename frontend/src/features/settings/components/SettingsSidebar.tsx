import { Dumbbell, CreditCard, Bell, Shield, User } from "lucide-react";

const sections = [
  { id: "gym", label: "Gym Info", icon: Dumbbell },
  { id: "profile", label: "Admin Profile", icon: User },
  { id: "pricing", label: "Pricing", icon: CreditCard },
  { id: "notifications", label: "Notifications", icon: Bell },
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
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition ${
            active === s.id
              ? "bg-emerald-500 text-white"
              : "text-slate-600 hover:bg-white hover:shadow-sm"
          }`}
        >
          <s.icon size={15} />
          {s.label}
        </button>
      ))}
    </div>
  );
}