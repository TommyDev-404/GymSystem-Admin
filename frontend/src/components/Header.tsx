import {
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ConfirmModal } from "./shared/ConfirmationModal";

export function Header() {
  const navigate = useNavigate();

  const [logout, setLogout] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 shrink-0 shadow-sm">
      {/* Greetings */}
      <div>
        <h1 className="text-md font-semibold text-slate-800">
          Welcome back, Admin!
        </h1>

        <p className="text-sm text-slate-500">
          Here’s what’s happening in your gym today.
        </p>
      </div>
      
      {/* Search */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 w-64 placeholder:text-slate-400"
            placeholder="Search anything..."
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/notifications")}
          className="relative p-2 rounded-xl hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors"
        >
          <Bell size={18} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        {/* Right side admin name */}
        <div className="relative flex items-center gap-2.5">
          {/* Avatar (NOT trigger) */}
          <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
            <span className="text-white text-xs font-semibold">JD</span>
          </div>

          {/* NAME = hover trigger */}
          <div className="relative group hidden sm:block cursor-pointer">
            <p className="text-slate-700 text-sm font-medium leading-none">
              Jhon Doe
            </p>
            <p className="text-slate-400 text-xs mt-0.5">
              Administrator
            </p>

            {/* Dropdown */}
            <div
              className="
                absolute right-0 mt-2 w-52
                bg-white border border-slate-100
                shadow-xl rounded-xl
                opacity-0 invisible
                group-hover:opacity-100 group-hover:visible
                transition-all duration-150 ease-out
                overflow-hidden
                z-50
              "
            >
              {/* Profile */}
              <button
                onClick={() =>
                  navigate("/settings", {
                    state: { active: "profile" },
                  })
                }
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <User size={16} className="text-slate-500" />
                <span>Profile</span>
                <ChevronRight size={14} className="ml-auto text-slate-400" />
              </button>

              {/* Settings */}
              <button
                onClick={() => navigate("/settings")}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
              >
                <Settings size={16} className="text-slate-500" />
                <span>Settings</span>
              </button>

              <div className="h-px bg-slate-100 my-1" />

              {/* Logout */}
              <button
                onClick={() => setLogout(!logout)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      <ConfirmModal
        open={logout}
        onOpenChange={() => setLogout(!logout)}
        title="Logout"
        description="Are you sure you want to log out from your account?"
        confirmText="Logout"
        cancelText="Stay Logged In"
        variant="destructive"
        onConfirm={() => navigate("/login")}
      />
    </header>
  );
}