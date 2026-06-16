import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SettingsHeader({
  saved,
  onSave,
}: {
  saved: boolean;
  onSave: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-slate-800 font-bold text-xl">Settings</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Manage your gym configuration
        </p>
      </div>

      <Button
        onClick={onSave}
        className={`rounded-xl ${
          saved
            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
            : "bg-emerald-500 hover:bg-emerald-600"
        }`}
      >
        <Save size={14} />
        {saved ? "Saved!" : "Save Changes"}
      </Button>
    </div>
  );
}