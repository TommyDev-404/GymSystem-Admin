import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "@/layout/AuthLayout";

export function Login() {
   const navigate = useNavigate();
   const [showPassword, setShowPassword] = useState(false);

   return (
      <AuthLayout
         title="Welcome back"
         subtitle=" Login to your Gym Admin Dashboard"
      >
         <div className="flex flex-col gap-3">
            {/* Email */}
            <div>
               <label className="text-sm text-slate-600">Email</label>
               <input
               type="email"
               className="w-full mt-1 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
               placeholder="admin@gym.com"
               />
            </div>

            {/* Password */}
            <div>
               <label className="text-sm text-slate-600">Password</label>

               <div className="relative mt-1">
                  <input
                     type={showPassword ? "text" : "password"}
                     className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-400 outline-none"
                     placeholder="••••••••"
                  />

                  <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                     {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
               </div>
            </div>

            {/* Forgot password */}
            <div className="text-right">
               <button
               onClick={() => navigate("/forgot-password")}
               className="text-sm text-emerald-600 hover:underline"
               >
               Forgot password?
               </button>
            </div>

            {/* Login button */}
            <button
               onClick={() => navigate('/dashboard')}
               className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-medium transition mt-4"
            >
               Login
            </button>
         </div>
      </AuthLayout>
   );
}