import { Button } from "@/components/ui/button";
import { VerifyCodeModal } from "@/features/settings/components/VerifyCodeModal";
import { useState } from "react";

type Props = {
  twoFactor: boolean;
  setTwoFactor: (v: boolean) => void;
  form: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  setForm: (v: any) => void;
};

export function SecuritySection({
  form,
  setForm,
}: Props) {
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [code, setCode] = useState("");

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
      <h3 className="text-slate-800 font-medium">Security Settings</h3>

      <div className="space-y-4">
        {/* New Password */}
        <div>
          <label className="text-slate-600 text-sm mb-1 block">
            New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={form.newPassword}
            onChange={(e) =>
              setForm({ ...form, newPassword: e.target.value })
            }
          />
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-slate-600 text-sm mb-1 block">
            Confirm New Password
          </label>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
        </div>

        {/* 2FA */}
        <div className="flex gap-4 justify-end">
          <Button variant="outline" className="p-4">
            <p className="text-slate-500">Cancel</p>
          </Button>

          <Button
            onClick={() => setVerifyModalOpen(!verifyModalOpen)}
            className="bg-emerald-500 p-4 hover:bg-emerald-600"
          >
            <p>Change password</p>
          </Button>
        </div>
      </div>

      <VerifyCodeModal
        open={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
        code={code}
        setCode={setCode}
        onVerify={() => {
          setVerifyModalOpen(false);

          // open change password modal here
        }}
      />

    </div>
  );
}