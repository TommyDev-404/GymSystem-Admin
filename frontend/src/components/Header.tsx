import {
  Search,
  User,
  ChevronRight,
  LayoutDashboard,
  UserPlus,
  Users,
  UserX,
  CalendarCheck,
  QrCode,
  Receipt,
  Clock,
  BadgeDollarSign,
  Trophy,
  Gift,
  Bell,
  Settings,
  LogOut,
  UserRound,
  PlusCircle,
  Sun,
  Moon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { LogoutConfirmationModal } from "./shared/LogoutConfirmationModal";
import { useAuth } from "@/context/AuthContext";
import { theme } from "@/utils/theme";

const searchItems = [
  {
    name: "Dashboard",
    description: "View gym statistics overview",
    path: "/dashboard",
    category: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Add Member",
    description: "Register a new gym member",
    path: "/members?action=add",
    category: "Members",
    icon: UserPlus,
  },
  {
    name: "View Members",
    description: "Manage all gym members",
    path: "/members",
    category: "Members",
    icon: Users,
  },
  {
    name: "Inactive Members",
    description: "View inactive gym members",
    path: "/members?filter=Inactive",
    category: "Members",
    icon: UserX,
  },
  {
    name: "Attendance History",
    description: "View member attendance records for this month",
    path: "/attendance?filter=history",
    category: "Attendance",
    icon: CalendarCheck,
  },
  {
    name: "Today's Attendance",
    description: "View today's member check-ins",
    path: "/attendance?filter=today",
    category: "Attendance",
    icon: Clock,
  },
  {
    name: "Generate QR Session",
    description: "Create attendance QR code",
    path: "/attendance?action=generate",
    category: "Attendance",
    icon: QrCode,
  },
  {
    name: "Add Payment",
    description: "Record a new member payment",
    path: "/payments?action=add",
    category: "Payments",
    icon: PlusCircle,
  },
  {
    name: "Pending Payments",
    description: "View unpaid membership fees",
    path: "/payments?filter=Pending",
    category: "Payments",
    icon: Clock,
  },
  {
    name: "Payment History",
    description: "View payment transaction history",
    path: "/payments",
    category: "Payments",
    icon: Receipt,
  },
  {
    name: "Expired Memberships",
    description: "View members with expired plans",
    path: "/payments?filter=Overdue",
    category: "Payments",
    icon: UserX,
  },
  {
    name: "Membership Pricing",
    description: "Manage membership plans and prices",
    path: "/settings?filter=pricing",
    category: "Pricing",
    icon: BadgeDollarSign,
  },
  {
    name: "Add Membership Plan",
    description: "Create a new membership package",
    path: "/settings?filter=pricing&action=add",
    category: "Membership",
    icon: PlusCircle,
  },
  {
    name: "View Rewards",
    description: "View all member rewards",
    path: "/rewards",
    category: "Rewards",
    icon: Gift,
  },
  {
    name: "Member Points",
    description: "View member reward points",
    path: "/rewards",
    category: "Rewards",
    icon: Trophy,
  },
  {
    name: "Create Reward",
    description: "Add a new reward item",
    path: "/rewards?action=create",
    category: "Rewards",
    icon: PlusCircle,
  },
  {
    name: "Notifications",
    description: "View system notifications",
    path: "/notifications",
    category: "Notifications",
    icon: Bell,
  },
  {
    name: "Admin Profile",
    description: "Manage admin profile",
    path: "/settings?filter=profile",
    category: "Settings",
    icon: UserRound,
  },
  {
    name: "Security",
    description: "Manage password, authentication, and security settings",
    path: "/settings?filter=security",
    category: "Settings",
    icon: Settings,
  },
];

export function Header() {
  const navigate = useNavigate();
  const { admin, logout } = useAuth();

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return [];

    return searchItems.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
    );
  }, [search]);

  const toggleDarkMode = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle("dark", checked);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setSearch("");
    setShowSearch(false);
  };

  const handleLogout = async () => {
    await logout();
    setShowLogout(false);
    navigate("/login", { replace: true });
  };

  const adminName = admin?.username || "Admin";

  const adminInitials = adminName
    .split(" ")
    .map((name: string) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="h-16 shrink-0 border-b border-slate-100 bg-white px-6 shadow-sm dark:border-stone-700 dark:bg-stone-900">
        <div className="flex h-full items-center justify-between">
          <div>
            <h1 className="text-md font-semibold text-slate-800 dark:text-slate-100">
              Welcome back, {adminName}!
            </h1>
            <p className="text-sm text-slate-400">
              Here’s what’s happening in your gym today.
            </p>
          </div>

          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onFocus={() => setShowSearch(true)}
              onChange={(event) => {
                setSearch(event.target.value);
                setShowSearch(true);
              }}
              className="w-100 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-100 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200 dark:focus:border-stone-600 dark:focus:ring-stone-800"
              placeholder="Search shortcuts..."
            />

            {showSearch && search.trim() && (
              <div className="absolute left-0 top-12 z-50 h-70 w-100 overflow-y-auto rounded-xl border border-slate-100 bg-white shadow-xl dark:border-stone-700 dark:bg-stone-900">
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={`${item.category}-${item.name}`}
                        type="button"
                        onClick={() => handleNavigate(item.path)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-slate-50 dark:hover:bg-stone-800"
                      >
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${theme.primaryLight}`}
                        >
                          <Icon size={17} className="text-white" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-100">
                            {item.name}
                          </p>
                          <p className="truncate text-xs text-slate-400 dark:text-slate-500">
                            {item.description}
                          </p>
                        </div>

                        <span className="shrink-0 text-[10px] text-slate-400 dark:text-slate-500">
                          {item.category}
                        </span>
                      </button>
                    );
                  })
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-slate-400 dark:text-slate-500">
                      No matching function found.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Sun
                size={16}
                className={`transition ${
                  darkMode ? "text-slate-500" : "text-amber-500"
                }`}
              />
              <Switch
                checked={darkMode}
                onCheckedChange={toggleDarkMode}
                className="data-[state=checked]:bg-stone-700 data-[state=unchecked]:bg-red-800"
              />
              <Moon
                size={16}
                className={`transition ${
                  darkMode ? "text-indigo-400" : "text-slate-400"
                }`}
              />
            </div>

            <div className="h-6 w-px bg-slate-200 dark:bg-stone-700" />

            <div className="relative flex items-center gap-2.5">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${theme.gradient}`}
              >
                <span className="text-xs font-semibold text-white">
                  {adminInitials}
                </span>
              </div>

              <div className="group relative hidden cursor-pointer sm:block">
                <p className="text-sm font-medium leading-none text-slate-700 dark:text-slate-100">
                  {adminName}
                </p>
                <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">
                  Administrator
                </p>

                <div className="invisible absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-slate-100 bg-white opacity-0 shadow-xl transition-all duration-150 ease-out group-hover:visible group-hover:opacity-100 dark:border-stone-700 dark:bg-stone-900">
                  <button
                    type="button"
                    onClick={() =>
                      navigate("/settings", {
                        state: { active: "profile" },
                      })
                    }
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-stone-800"
                  >
                    <User
                      size={16}
                      className="text-slate-500 dark:text-slate-400"
                    />
                    <span>Profile</span>
                    <ChevronRight
                      size={14}
                      className="ml-auto text-slate-400"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/settings")}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-stone-800"
                  >
                    <Settings
                      size={16}
                      className="text-slate-500 dark:text-slate-400"
                    />
                    <span>Settings</span>
                    <ChevronRight
                      size={14}
                      className="ml-auto text-slate-400"
                    />
                  </button>

                  <div className="my-1 h-px bg-slate-100 dark:bg-stone-700" />

                  <button
                    type="button"
                    onClick={() => setShowLogout(true)}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <LogoutConfirmationModal
        open={showLogout}
        onOpenChange={setShowLogout}
        title="Logout"
        description="Are you sure you want to log out from your account?"
        confirmText="Logout"
        cancelText="Stay Logged In"
        variant="destructive"
        onConfirm={handleLogout}
      />
    </>
  );
}