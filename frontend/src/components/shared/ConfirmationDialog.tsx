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
  type?: string;
  onClose: () => void;
  onConfirm?: () => void;
  isPending?: boolean;
}

export function ConfirmationDialog({
  open,
  name,
  type,
  onClose,
  onConfirm,
  isPending,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[92vw] sm:max-w-sm p-0 overflow-hidden">

        {/* HEADER */}
        <DialogHeader className="px-6 pt-6 pb-4">
          <div className="flex flex-col items-center text-center gap-3">

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60 flex items-center justify-center">
              <AlertTriangle className="text-red-500 dark:text-red-400" size={22} />
            </div>

            <div>
              <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Delete {type}?
              </DialogTitle>

              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                This action cannot be undone.
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* CONTENT */}
        <div className="px-6 pb-2">
          <div className="border rounded-xl px-4 py-3 text-sm text-slate-600 dark:text-slate-300 text-center">
            You are about to delete{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {name}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <DialogFooter className="p-6 border-t flex gap-3 sm:justify-stretch">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 h-11 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </Button>

          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 h-11 bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white disabled:opacity-60"
          >
            <Trash2 size={16} className="mr-2" />
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  );
}