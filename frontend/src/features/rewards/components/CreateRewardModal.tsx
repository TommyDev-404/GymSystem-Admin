import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function CreateRewardModal({
  open,
  setOpen,
  form,
  setForm,
  onCreate,
}: any) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="p-0 overflow-hidden max-w-md">
        {/* HEADER (custom styled, not shadcn default) */}
        <DialogTitle>
          <div className="flex items-center justify-between px-6 pt-6 mb-5">
            <h2 className="text-slate-800 font-semibold">
              Create New Reward
            </h2>
          </div>
        </DialogTitle>

        {/* BODY */}
        <div className="px-6 space-y-4">
          {/* Title */}
          <div>
            <label className="text-slate-600 text-sm mb-1 block">
              Reward Title
            </label>
            <Input
              className="rounded-xl border-slate-200 focus:ring-2 focus:ring-emerald-400"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
              placeholder="e.g. Free Protein Shake"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-slate-600 text-sm mb-1 block">
              Description
            </label>
            <Textarea
              className="rounded-xl border-slate-200 focus:ring-2 focus:ring-emerald-400 resize-none"
              rows={2}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Brief description..."
            />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 text-sm mb-1 block">
                Points Required
              </label>
              <Input
                type="number"
                className="rounded-xl border-slate-200 focus:ring-2 focus:ring-emerald-400"
                value={form.points}
                onChange={(e) =>
                  setForm({ ...form, points: +e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-slate-600 text-sm mb-1 block">
                Category
              </label>
              <select
                className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option>Fitness</option>
                <option>Nutrition</option>
                <option>Loyalty</option>
                <option>Special</option>
              </select>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex gap-3 mt-6 px-6 pb-6">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onCreate}
            className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600"
          >
            Create Reward
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}