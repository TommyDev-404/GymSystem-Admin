import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  CreditCard,
  Trophy,
  BarChart3,
  Bell,
  FileText,
  Settings,
  Dumbbell,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { AppLogo } from "./shared/AppLogo";

const navItems = [
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { id: "members", label: "Members", path: "/members", icon: Users },
  { id: "attendance", label: "Attendance", path: "/attendance", icon: CalendarCheck },
  { id: "payments", label: "Payments", path: "/payments", icon: CreditCard },
  { id: "rewards", label: "Rewards", path: "/rewards", icon: Trophy },
  { id: "analytics", label: "Analytics", path: "/analytics", icon: BarChart3 },
  { id: "notifications", label: "Notifications", path: "/notifications", icon: Bell },
  { id: "reports", label: "Reports", path: "/reports", icon: FileText },
  { id: "settings", label: "Settings", path: "/settings", icon: Settings },
];

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`flex flex-col h-screen bg-[#1e293b] text-slate-200
      transition-all duration-300 ease-in-out
      ${collapsed ? "w-16" : "w-60"}`}
    >
      {/* ================= LOGO ================= */}
      <div className="flex items-center h-18 px-3 border-b border-slate-700 relative">
        
        <div className="flex items-center gap-3 w-full h-full">
          <AppLogo collapsed={collapsed} />
        </div>

        {/* Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-emerald-500 border border-white rounded-full flex items-center justify-center shadow-md"
        >
          <ChevronRight
            size={14}
            className={`transition-transform duration-300 ${
              collapsed ? "" : "rotate-180"
            }`}
          />
        </button>
      </div>

      {/* ================= NAV ================= */}
      <nav className="flex-1 px-2 py-4 space-y-1 relative">
        {navItems.map(({ id, label, icon: Icon, path }) => (
          <div key={id} className="group relative">
            <NavLink
              to={path}
              onClick={() => onNavigate(id)}
              className={({ isActive }) =>
                `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-opacity duration-200 ${
                  isActive
                    ? "bg-emerald-500 text-white font-medium"
                    : "text-slate-400 hover:bg-slate-700 hover:text-slate-100"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />

              {/* LABEL with smooth fade + collapse */}
              <span
                className={`whitespace-nowrap transition-all duration-400 ease-in-out will-change-transform
                ${collapsed
                  ? "opacity-0 -translate-x-2"
                  : "opacity-100 translate-x-0"
                }`}
              >
                {label}
              </span>
            </NavLink>

            {/* TOOLTIP when collapsed */}
            {collapsed && (
              <span
                className="
                  pointer-events-none
                  absolute left-full top-1/2 -translate-y-1/2 ml-2
                  px-3 py-1.5 bg-emerald-500 text-white text-sm
                  rounded-md shadow-lg whitespace-nowrap
                  opacity-0 scale-95
                  group-hover:opacity-100 group-hover:scale-100
                  transition-opacity duration-200 ease-out
                  z-50
                "
              >
                {label}

                {/* arrow */}
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-emerald-500 rotate-45" />
              </span>
            )}
          </div>
        ))}
      </nav>

      {/* ================= FOOTER ================= */}
      <div className="border-t border-slate-700 p-3">

        {/* Expanded text */}
        <div
          className={`transition-opacity duration-200 ease-out
          ${collapsed ? "opacity-0 -translate-x-2" : "opacity-100 translate-x-0"}
          `}
        >
          <div className="text-xs text-slate-400">
            Powered by JFitness Gym
          </div>
          <div className="text-[10px] text-slate-600">
            All systems operational
          </div>
        </div>

        {/* Collapsed dot (also opacity-based) */}
        <div
          className={`flex justify-center transition-opacity duration-200 ease-in
          ${collapsed ? "opacity-100" : "opacity-0"}
          `}
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>

      </div>
      
    </aside>
  );
}