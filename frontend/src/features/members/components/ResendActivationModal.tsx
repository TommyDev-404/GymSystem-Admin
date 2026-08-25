import { AlertTriangle, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Member } from "@/features/members/types/member";
import { useResendActivationCode } from "../hooks/useMember";
import { toast } from "sonner";
import { theme } from "@/utils/theme";

type Props = {
  open: boolean;
  member: Member;
  onClose: () => void;
};

export function ResendActivationModal({
  open,
  member,
  onClose,
}: Props) {
  const { mutate: resendActivationCode, isPending } =
    useResendActivationCode();

  const handleResend = (email: string) => {
    resendActivationCode(
      { email },
      {
        onSuccess: () => {
          toast.success(
            "Activation code has been sent to the member’s email.",
          );
          onClose();
        },
        onError: () => {
          toast.error(
            "Failed to resend activation code. Please try again.",
          );
        },
      },
    );
  };

  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl border-stone-200 bg-white sm:max-w-md dark:border-stone-700 dark:bg-stone-900">
        <DialogHeader className="items-center text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#963348]/10">
            <AlertTriangle className="h-6 w-6 text-[#963348] dark:text-[#C45A6F]" />
          </div>

          <DialogTitle className="text-slate-800 dark:text-slate-100">
            Resend Activation Code
          </DialogTitle>

          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Send a new activation code to
          </DialogDescription>
        </DialogHeader>

        <div className="text-center">
          <p className="font-semibold text-slate-800 dark:text-slate-100">
            {member.fullname}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {member.email}
          </p>
        </div>

        <div className="rounded-lg border border-[#963348]/20 bg-[#963348]/5 p-3 text-xs text-slate-600 dark:border-[#963348]/30 dark:bg-[#963348]/10 dark:text-slate-300">
          A new activation code will invalidate the previous one.
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="h-11 flex-1 border-slate-200 dark:border-stone-700 dark:text-slate-200 dark:hover:bg-stone-800"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            className={`h-11 flex-1 ${theme.gradient} text-white`}
            disabled={isPending}
            onClick={() => handleResend(member.email)}
          >
            <Mail className="mr-2 h-4 w-4" />
            {isPending ? "Sending..." : "Resend Code"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}