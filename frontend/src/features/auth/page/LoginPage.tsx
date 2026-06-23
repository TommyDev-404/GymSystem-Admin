import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layout/AuthLayout";
import { loginApi } from "@/features/auth/api/auth.api";

type LoginForm = {
  email: string;
  password: string;
};

export function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      setLoading(true);
      setError(null);

      const res = await loginApi({
        username: data.email, // backend expects username
        password: data.password,
      });
       
      localStorage.setItem("token", res.token);

      navigate("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Login to your Gym Admin Dashboard"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
        >
           
         {/* Error */}
         {error && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
               <span className="text-red-500 text-sm font-medium">
                  ⚠
               </span>

               <p className="text-sm text-red-600">
                  {error}
               </p>
            </div>
         )}
           
        {/* Email */}
        <div>
          <label className="text-sm text-slate-600">
            Email
          </label>

          <input
            type="text"
            placeholder="admin@gym.com"
            className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
            {...register("email", {
              required: "Email is required",
            })}
          />

          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="text-sm text-slate-600">
            Password
          </label>

          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
              {...register("password", {
                required: "Password is required",
              })}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
            >
              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>
         
        {/* Forgot password */}
        <div className="text-right">
          <button
            type="button"
            onClick={() =>
              navigate("/forgot-password")
            }
            className="text-sm text-emerald-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-medium transition mt-4"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthLayout>
  );
}