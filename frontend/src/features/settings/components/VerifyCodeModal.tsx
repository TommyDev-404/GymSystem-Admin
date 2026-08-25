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
import { theme } from "@/utils/theme";

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
  reset,
}: VerifyCodeModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerifyCode = async () => {
    try {
      setLoading(true);
      setError("");

      await verifyOtpApi({
        email,
        code,
      });

      await resetPasswordApi({
        email,
        newPassword,
      });

      toast.success("Password changed successfully.");
      setCode("");
      onClose();
    } catch (err: any) {
      const message =
        err?.response?.data?.message || "Invalid verification code";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="rounded-2xl border-[#E8C7CC] bg-white sm:max-w-md dark:border-stone-700 dark:bg-stone-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Verify Identity
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Enter the 6-digit verification code sent to your email.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <Input
            maxLength={6}
            value={code}
            onChange={(e) => {
              setError("");
              setCode(e.target.value.replace(/\D/g, ""));
            }}
            placeholder="------"
            className="h-12 border-slate-200 bg-white text-center text-lg tracking-[0.5em] text-slate-700 focus-visible:border-[#8B1E2D] focus-visible:ring-[#8B1E2D]/20 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200"
          />

          {error && (
            <p className="text-center text-sm text-red-500">
              {error}
            </p>
          )}

          <Button
            className={`h-11 w-full ${theme.gradient} text-white `}
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