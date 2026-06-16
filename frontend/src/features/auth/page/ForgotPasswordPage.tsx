import { AuthLayout } from "@/layout/AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle={
        step === 1
          ? "Enter your email and we'll send a recovery code."
          : step === 2
          ? "Enter the 6-digit recovery code."
          : "Create your new password."
      }
    >
      <div className="flex flex-col gap-4">

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <>
            <div>
              <label className="text-sm text-slate-600">Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@gym.com"
                className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-medium transition"
            >
              Send Recovery Code
            </button>
          </>
        )}

        {/* STEP 2: CODE */}
        {step === 2 && (
          <>
            <div>
              <label className="text-sm text-slate-600">
                Recovery Code
              </label>

              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) =>
                  setCode(e.target.value.replace(/\D/g, ""))
                }
                placeholder="123456"
                className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 text-center tracking-[0.5em] text-lg focus:ring-2 focus:ring-emerald-400 outline-none"
              />
            </div>

            <button
              onClick={() => navigate('/change-password')}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-medium transition"
            >
              Verify Code
            </button>
          </>
        )}

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