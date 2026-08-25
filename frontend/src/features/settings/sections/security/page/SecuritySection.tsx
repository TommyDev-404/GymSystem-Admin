import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { VerifyCodeModal } from "@/features/settings/components/VerifyCodeModal";
import { useAuth } from "@/context/AuthContext";
import { sentCodeApi } from "@/features/auth/api/auth.api";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { theme } from "@/utils/theme";

type PasswordForm = {
  newPassword: string;
  confirmPassword: string;
};

export function SecuritySection() {
  const { admin } = useAuth();
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PasswordForm>({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const handleSendOtp = async () => {
    if (!admin?.email) {
      toast.error("Admin email not found.");
      return;
    }

    try {
      setLoading(true);

      await sentCodeApi({
        email: admin.email,
      });

      setVerifyModalOpen(true);
      toast.success("We've sent you a recovery code. Please check your email.");
    } catch (err) {
      console.error("Failed to send OTP:", err);
      toast.error("Failed to send recovery code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      return;
    }

    handleSendOtp();
  };

  return (
    <Card className="rounded-2xl border-[#E8C7CC] bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <div className="space-y-5 p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Security Settings
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              New Password
            </label>

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="h-11 rounded-xl border-slate-200 bg-white text-slate-700 focus-visible:border-[#8B1E2D] focus-visible:ring-[#8B1E2D]/20 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200"
            />

            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
              Confirm New Password
            </label>

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              className="h-11 rounded-xl border-slate-200 bg-white text-slate-700 focus-visible:border-[#8B1E2D] focus-visible:ring-[#8B1E2D]/20 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200"
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="show-password"
              checked={showPassword}
              onCheckedChange={(checked) =>
                setShowPassword(checked === true)
              }
              className="border-slate-300 data-[state=checked]:border-[#8B1E2D] data-[state=checked]:bg-[#8B1E2D] dark:border-stone-600"
            />

            <label
              htmlFor="show-password"
              className="cursor-pointer text-sm text-slate-600 dark:text-slate-300"
            >
              Show password
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              className="h-11 border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-stone-700 dark:text-slate-200 dark:hover:bg-stone-800"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className={`h-11 ${theme.gradient} text-white`}
            >
              {loading ? "Sending..." : "Change Password"}
            </Button>
          </div>
        </form>

        <VerifyCodeModal
          open={verifyModalOpen}
          onClose={() => setVerifyModalOpen(false)}
          email={admin!.email}
          newPassword={newPassword}
          code={code}
          setCode={setCode}
          reset={reset}
        />
      </div>
    </Card>
  );
}