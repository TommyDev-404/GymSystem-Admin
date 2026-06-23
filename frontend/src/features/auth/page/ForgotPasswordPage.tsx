import { AuthLayout } from "@/layout/AuthLayout";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import {
  forgotPasswordApi,
  verifyOtpApi,
} from "@/features/auth/api/auth.api";

type EmailForm = {
  email: string;
};

type CodeForm = {
  code: string;
};

export function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ---------------- RHF ---------------- */
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailForm>();

  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors },
  } = useForm<CodeForm>();

  /* ---------------- STEP 1: SEND EMAIL ---------------- */
  const onSendEmail = async (data: EmailForm) => {
    try {
      setLoading(true);
      setError(null);

      await forgotPasswordApi({ email: data.email });

      setEmail(data.email);
      setStep(2);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- STEP 2: VERIFY CODE ---------------- */
  const onVerifyCode = async (data: CodeForm) => {
    try {
      setLoading(true);
      setError(null);

      await verifyOtpApi({
        email,
        code: data.code,
      });

      setStep(3);
      navigate("/change-password", {
        state: { email },
      });
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid code"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle={
        step === 1
          ? "Enter your email and we'll send a recovery code."
          : step === 2
          ? "Enter the 6-digit recovery code."
          : "Redirecting..."
      }
    >
      <div className="flex flex-col gap-4">

        {/* ERROR UI */}
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <form
            onSubmit={handleEmailSubmit(onSendEmail)}
            className="flex flex-col gap-3"
          >
            <div>
              <label className="text-sm text-slate-600">
                Email
              </label>

              <input
                type="email"
                placeholder="admin@gym.com"
                className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                {...registerEmail("email", {
                  required: "Email is required",
                })}
              />

              {emailErrors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {emailErrors.email.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition"
            >
              {loading
                ? "Sending..."
                : "Send Recovery Code"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form
            onSubmit={handleCodeSubmit(onVerifyCode)}
            className="flex flex-col gap-3"
          >
            <div>
              <label className="text-sm text-slate-600">
                Recovery Code
              </label>

              <input
                type="text"
                maxLength={6}
                placeholder="123456"
                className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 text-center tracking-[0.5em] text-lg focus:ring-2 focus:ring-emerald-400 outline-none"
                {...registerCode("code", {
                  required: "Code is required",
                  minLength: 6,
                })}
              />

              {codeErrors.code && (
                <p className="text-red-500 text-xs mt-1">
                  {codeErrors.code.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition"
            >
              {loading
                ? "Verifying..."
                : "Verify Code"}
            </button>
          </form>
        )}

        {/* BACK TO LOGIN */}
        <button
          onClick={() => navigate("/login")}
          className="text-sm text-slate-500 hover:text-slate-700"
        >
          Back to login
        </button>
      </div>
    </AuthLayout>
  );
}