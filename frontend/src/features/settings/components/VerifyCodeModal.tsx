import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

import { verifyOtpApi, resetPasswordApi } from "@/features/auth/api/auth.api";

interface VerifyCodeModalProps {
  open: boolean;
  onClose: () => void;
  email: string;
  newPassword: string;
  code: string;
  setCode: (value: string) => void;
  reset: () => void;
}

export function VerifyCodeModal({
  open,
  onClose,
  email,
  newPassword,
  code,
  setCode,
  reset
}: VerifyCodeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      setError("");

      // Verify OTP first
      await verifyOtpApi({
        email,
        code,
      });

      // Reset password after OTP success
      await resetPasswordApi({
        email,
        newPassword,
      });

      toast.success("Password changed successfully");

      setCode("");
      onClose();

    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Invalid verification code";

      setError(message);
      toast.error(message);

    } finally {
      setLoading(false);
      reset();
    }
  };

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
            placeholder="------"
            className="
              text-center
              text-lg
              tracking-[0.5em]
              h-12
            "
          />


          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}


          <Button
            className="w-full bg-emerald-500 hover:bg-emerald-600"
            onClick={handleVerifyCode}
            disabled={loading || code.length !== 6}
          >
            {loading ? "Verifying..." : "Verify Code"}
          </Button>

        </div>

      </DialogContent>
    </Dialog>
  );
}