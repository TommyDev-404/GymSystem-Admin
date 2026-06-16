import { AuthLayout } from "@/layout/AuthLayout";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export function ChangePassword() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <AuthLayout
      title="Change Password"
      subtitle="Create a new password for your account."
    >
      <div className="flex flex-col gap-4">

        {/* New Password */}
        <div>
          <label className="text-sm text-slate-600">
            New Password
          </label>

          <div className="relative mt-1">
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showNewPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm text-slate-600">
            Confirm Password
          </label>

          <div className="relative mt-1">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showConfirmPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
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

        {/* Submit */}
         <button
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-medium transition"
         >
          Change Password
        </button>
      </div>
    </AuthLayout>
  );
}