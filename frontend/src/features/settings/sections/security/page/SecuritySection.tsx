import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { VerifyCodeModal } from "@/features/settings/components/VerifyCodeModal";

import { useAuth } from "@/context/AuthContext";
import { sentCodeApi } from "@/features/auth/api/auth.api";
import { toast } from "sonner";

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
    try {
      setLoading(true);

      if (!admin?.email) {
        throw new Error("Admin email not found");
      }

      await sentCodeApi({
        email: admin.email,
      });

      setVerifyModalOpen(true);

    } catch (err) {
      console.error("Failed to send OTP:", err);
    } finally {
      setLoading(false);
      toast.success("We've sent you a recovery code in your email. Please check it.")
    }
  };

  const onSubmit = (data: PasswordForm) => {
    if (data.newPassword !== data.confirmPassword) {
      return;
    }

    handleSendOtp();
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
      <h3 className="text-slate-800 font-medium">
        Security Settings
      </h3>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4"
      >
        {/* New Password */}
        <div>
          <label className="text-slate-600 text-sm mb-1 block">
            New Password
          </label>

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="rounded-xl py-2.5"
            {...register("newPassword", {
              required: "New password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />

          {errors.newPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-slate-600 text-sm mb-1 block">
            Confirm New Password
          </label>

          <Input
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="rounded-xl py-2.5"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === newPassword ||
                "Passwords do not match",
            })}
          />

          {errors.confirmPassword && (
            <p className="text-sm text-red-500 mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Show Password Checkbox */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="show-password"
            checked={showPassword}
            onCheckedChange={(checked) =>
              setShowPassword(checked === true)
            }
          />

          <label
            htmlFor="show-password"
            className="text-sm text-slate-600 cursor-pointer"
          >
            Show password
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            className="p-4"
            onClick={() => reset()}
          >
            <p className="text-slate-500">
              Cancel
            </p>
          </Button>

          <Button
            type="submit"
            disabled={loading}
            className="bg-emerald-500 p-4 hover:bg-emerald-600"
          >
            <p>
              {loading ? "Sending..." : "Change password"}
            </p>
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
  );
}