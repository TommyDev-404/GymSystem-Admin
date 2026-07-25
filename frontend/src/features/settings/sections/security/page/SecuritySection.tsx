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
    <Card
      className="
        rounded-2xl
        border-stone-200
        dark:border-stone-700
        bg-white
        dark:bg-stone-900
        shadow-sm
      "
    >
      <div className="p-6 space-y-5">

        <h3
          className="
            text-lg
            font-semibold
            text-slate-800
            dark:text-slate-100
          "
        >
          Security Settings
        </h3>


        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >

          {/* NEW PASSWORD */}
          <div className="space-y-1.5">

            <label
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
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
              className="
                h-11
                rounded-xl
                bg-white
                dark:bg-stone-800
                border-slate-200
                dark:border-stone-700
                text-slate-700
                dark:text-slate-200
              "
            />


            {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.newPassword.message}
              </p>
            )}

          </div>



          {/* CONFIRM PASSWORD */}
          <div className="space-y-1.5">

            <label
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Confirm New Password
            </label>


            <Input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === newPassword ||
                  "Passwords do not match",
              })}
              className="
                h-11
                rounded-xl
                bg-white
                dark:bg-stone-800
                border-slate-200
                dark:border-stone-700
                text-slate-700
                dark:text-slate-200
              "
            />


            {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}

          </div>



          {/* SHOW PASSWORD */}
          <div className="
            flex
            items-center
            gap-2
          ">

            <Checkbox
              id="show-password"
              checked={showPassword}
              onCheckedChange={(checked) =>
                setShowPassword(checked === true)
              }
            />


            <label
              htmlFor="show-password"
              className="
                text-sm
                text-slate-600
                dark:text-slate-300
                cursor-pointer
              "
            >
              Show password
            </label>

          </div>



          {/* ACTIONS */}
          <div
            className="
              flex
              justify-end
              gap-3
              pt-3
            "
          >

            <Button
              type="button"
              variant="outline"
              onClick={() => reset()}
              className="
                h-11
                border-slate-200
                dark:border-stone-700
                dark:text-slate-200
                dark:hover:bg-stone-800
              "
            >
              Cancel
            </Button>


            <Button
              type="submit"
              disabled={loading}
              className="
                h-11
                bg-emerald-500
                hover:bg-emerald-600
                text-white
              "
            >
              {loading
                ? "Sending..."
                : "Change Password"}
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