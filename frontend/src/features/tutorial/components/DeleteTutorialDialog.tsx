import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Trash2, AlertTriangle } from "lucide-react";

interface Props {
  open: boolean;
  name?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteTutorialDialog({
  open,
  name,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[92vw] p-0 overflow-hidden border border-slate-200">

        {/* HEADER */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex flex-col items-center text-center gap-3">

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={22} />
            </div>

            <div>
              <DialogTitle className="text-lg font-semibold text-slate-800">
                Delete workout?
              </DialogTitle>

              <p className="text-sm text-slate-500 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* CONTENT */}
        <div className="px-6 pb-6">
          <div className="bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm text-slate-600 text-center">
            You are about to delete{" "}
            <span className="font-semibold text-slate-800">
              {name || "this workout"}
            </span>
          </div>
        </div>

        {/* FOOTER (MATCHES MODAL SPACING) */}
        <DialogFooter className="p-8 border-t bg-white flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1  py-2.5"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5"
          >
            <Trash2 size={16} className="mr-2" />
            Delete
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}