import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PlanModal } from "@/features/settings/components/PlanModal";

type Plan = {
  id: string;
  label: string;
  value: number;
  duration: number;
  durationType: "Day" | "Week" | "Month";
  color: string;
  badge: string;
};

type Props = {
  plans: Plan[];
  setPlans: React.Dispatch<React.SetStateAction<Plan[]>>;
  onChange: (id: string, field: keyof Plan, value: any) => void;
  onDelete: (id: string) => void;
};

export function PricingSection({
  plans,
  setPlans,
  onChange,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    price: 0,
    duration: 1,
    durationType: "Month" as "Day" | "Week" | "Month",
  });

  // OPEN MODAL (ADD)
  const handleAdd = () => {
    setForm({
      name: "",
      price: 0,
      duration: 1,
      durationType: "Month",
    });
    setOpen(true);
  };

  // SAVE NEW PLAN
  const handleSave = () => {
    const newPlan: Plan = {
      id: crypto.randomUUID(),
      label: form.name,
      value: form.price,
      duration: form.duration,
      durationType: form.durationType,
      color: "bg-slate-50",
      badge: "bg-slate-100 text-slate-600",
    };

    setPlans([...plans, newPlan]);
    setOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-slate-800 font-medium">
          Membership Pricing
        </h3>

        <Button
          size="sm"
          className="bg-emerald-500 hover:bg-emerald-600"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Plan
        </Button>
      </div>

      {/* PLANS */}
      <div className="space-y-4">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`border rounded-2xl p-4 space-y-4 ${plan.color}`}
          >

            {/* TOP */}
            <div className="flex items-center justify-between">
              <span className={`px-3 py-1 rounded-lg text-sm font-medium ${plan.badge}`}>
                {plan.label}
              </span>

              <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(plan.id)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>

            {/* PRICE + DURATION */}
            <div className="grid grid-cols-3 gap-3">

              <Input
                type="number"
                value={plan.value}
                onChange={(e) =>
                  onChange(plan.id, "value", Number(e.target.value))
                }
              />

              <Input
                type="number"
                value={plan.duration}
                onChange={(e) =>
                  onChange(plan.id, "duration", Number(e.target.value))
                }
              />

              <Select
                value={plan.durationType}
                onValueChange={(value) =>
                  onChange(plan.id, "durationType", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="Day">Day</SelectItem>
                  <SelectItem value="Week">Week</SelectItem>
                  <SelectItem value="Month">Month</SelectItem>
                </SelectContent>
              </Select>

            </div>

          </div>
        ))}
      </div>

      {/* 🔥 PLAN MODAL */}
      <PlanModal
        open={open}
        setOpen={setOpen}
        form={form}
        setForm={setForm}
        onSave={handleSave}
      />

    </div>
  );
}