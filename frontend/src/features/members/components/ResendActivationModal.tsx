import { Mail, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import type { Member } from "@/features/members/types/member";
import { useResendActivationCode } from "../hooks/useMember";
import { toast } from "sonner";

type Props = {
  open: boolean;
  member: Member;
  onClose: () => void;
  loading?: boolean;
};

export function ResendActivationModal({
  open,
  member,
  onClose,
}: Props) {

  const { mutate: resendActivationCode, isPending } = useResendActivationCode();

  const handleResend = (email: string) => {
    resendActivationCode(
      { email },
      {
        onSuccess: () => {
          toast.success("Activation code has been sent to the member’s email.");
          
          onClose();
        },
        onError: () => {
          toast.error("Failed to resend activation code. Please try again.");
        },
      }
    );
  };
  
  if (!member) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 mb-3">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>

          <DialogTitle>
            Resend Activation Code
          </DialogTitle>

          <DialogDescription>
            Send a new activation code to
          </DialogDescription>
        </DialogHeader>

        {/* Member info */}
        <div className="text-center">
          <p className="font-semibold text-slate-800">
            {member.fullname}
          </p>

          <p className="text-xs text-slate-500">
            {member.email}
          </p>
        </div>

        {/* Warning */}
        <div className="rounded-lg border bg-muted p-3 text-xs text-muted-foreground">
          ⚠️ A new activation code will invalidate the previous one.
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={onClose}
          >
            Cancel
          </Button>

          <Button
            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
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