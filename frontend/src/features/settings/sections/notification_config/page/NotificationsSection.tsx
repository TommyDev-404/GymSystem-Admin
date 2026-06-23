import { Toggle } from "@/features/settings/components/Toggle";

type Item = {
  id: string;
  label: string;
  desc: string;
  value: boolean;
};

type Props = {
  items: Item[];
  onChange: (id: string, value: boolean) => void;
};

export function NotificationsSection({ items, onChange }: Props) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
      <h3 className="text-slate-800 font-medium">Notification Preferences</h3>

      <div className="space-y-3">
        {items.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
          >
            <div>
              <p className="text-slate-700 text-sm font-medium">{n.label}</p>
              <p className="text-slate-400 text-xs mt-0.5">{n.desc}</p>
            </div>

            <Toggle
              value={n.value}
              onChange={(val) => onChange(n.id, val)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}