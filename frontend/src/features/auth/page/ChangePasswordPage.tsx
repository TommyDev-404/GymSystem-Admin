import { AuthLayout } from "@/layout/AuthLayout";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { resetPasswordApi } from "@/features/auth/api/auth.api";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";

type FormData = {
  newPassword: string;
  confirmPassword: string;
};

export function ChangePassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = (location.state as any)?.email;

  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>();

  const newPassword = watch("newPassword");

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);

      if (data.newPassword !== data.confirmPassword) {
        setError("Passwords do not match");
        return;
      }

      const res = await resetPasswordApi({
        email,
        newPassword: data.newPassword,
      });

      toast.success(res.message);

      navigate("/login");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Change Password"
      subtitle="Create a new password for your account."
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {/* ERROR */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* NEW PASSWORD */}
        <div>
          <label className="text-sm text-slate-600">
            New Password
          </label>

          <div className="relative mt-1">
            <input
              type={
                showNewPassword ? "text" : "password"
              }
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message:
                    "Password must be at least 8 characters",
                },
              })}
            />

            <button
              type="button"
              onClick={() =>
                setShowNewPassword(!showNewPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showNewPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>

          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div>
          <label className="text-sm text-slate-600">
            Confirm Password
          </label>

          <div className="relative mt-1">
            <input
              type={
                showConfirmPassword ? "text" : "password"
              }
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              {...register("confirmPassword", {
                required: "Confirm your password",
                validate: (value) =>
                  value === newPassword ||
                  "Passwords do not match",
              })}
            />

            <button
              type="button"
              onClick={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showConfirmPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>

          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* PASSWORD RULES */}
        <div className="rounded-xl bg-slate-50 border border-slate-200 p-3">
          <p className="text-xs text-slate-500">
            Password should:
          </p>

          <ul className="mt-2 text-xs text-slate-500 space-y-1 list-disc list-inside">
            <li>Contain at least 8 characters</li>
            <li>Include one uppercase letter</li>
            <li>Include one lowercase letter</li>
            <li>Include one number</li>
          </ul>
        </div>

        {/* SUBMIT */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition"
        >
          {loading
            ? "Updating..."
            : "Change Password"}
        </button>
      </form>
    </AuthLayout>
  );
}