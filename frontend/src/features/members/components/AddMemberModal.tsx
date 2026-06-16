import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Member } from "@/features/members/types/member";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
  member?: Member | null;
  form: any;
  setForm: (v: any) => void;
  onSave: () => void;
}

const planOptions = [
  { value: "Basic", label: "Basic (1 month)" },
  { value: "Premium", label: "Premium (2 months)" },
  { value: "Elite", label: "Elite (6 months)" },
];

export function AddMemberModal({
  open,
  setOpen,
  member,
  form,
  setForm,
  onSave,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl">

        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-800">
            {member ? "Edit Member" : "Add Member"}
          </DialogTitle>
        </DialogHeader>

        {/* FORM */}
        <div className="flex flex-col gap-4 mt-2">

          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Full Name</label>
            <Input
              className="w-full"
              placeholder="Enter full name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* Age */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Age</label>
            <Input
              className="w-full"
              type="number"
              value={form.age}
              onChange={(e) =>
                setForm({ ...form, age: +e.target.value })
              }
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Gender</label>
            <Select
              value={form.gender}
              onValueChange={(value) =>
                setForm({ ...form, gender: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Plan */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">Plan</label>

            <Select
              value={form.plan}
              onValueChange={(value) =>
                setForm({ ...form, plan: value })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Plan" />
              </SelectTrigger>

              <SelectContent>
                {planOptions.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* JOINED DATE (NEW) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-600">
              Joined Date
            </label>

            <Input
              className="w-full"
              type="date"
              value={form.joined || new Date().toISOString().split("T")[0]}
              onChange={(e) =>
                setForm({ ...form, joined: e.target.value })
              }
            />
          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>

          <Button
            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            onClick={onSave}
          >
            {member ? "Save Changes" : "Add Member"}
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  );
}