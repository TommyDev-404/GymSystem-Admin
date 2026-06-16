import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface VerifyCodeModalProps {
  open: boolean;
  onClose: () => void;
  code: string;
  setCode: (value: string) => void;
  onVerify: () => void;
}

export function VerifyCodeModal({
  open,
  onClose,
  code,
  setCode,
  onVerify,
}: VerifyCodeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle>
            Verify Identity
          </DialogTitle>

          <DialogDescription>
            Enter the 6-digit verification code sent to your email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <Input
            maxLength={6}
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, ""))
            }
            placeholder="123456"
            className="
              text-center
              text-lg
              tracking-[0.5em]
              h-12
            "
          />

          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600"
            onClick={onVerify}
          >
            Verify Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}