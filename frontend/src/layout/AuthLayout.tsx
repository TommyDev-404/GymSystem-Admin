import { AppLogo } from "@/components/shared/AppLogo";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-md bg-white border border-slate-300 shadow-lg rounded-2xl p-6 space-y-6">

        {/* Header (fixed position for all auth pages) */}
        <div className="flex flex-col items-center text-center space-y-3">
          <AppLogo color="text-emerald-600"/>

          <div className="mt-6">
            <h1 className="text-xl font-semibold text-slate-800">
              {title}
            </h1>
            <p className="text-sm text-slate-500">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Page content */}
        {children}
      </div>
    </div>
  );
}