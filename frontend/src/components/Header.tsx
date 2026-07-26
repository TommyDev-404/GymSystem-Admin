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
  UserCog,
  Settings,
  LogOut,
  UserRound,
  PlusCircle,
  Sun,
  Moon
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoutConfirmationModal } from "./shared/LogoutConfirmationModal";
import { Switch } from "@/components/ui/switch";

const searchItems = [
  // Dashboard
  {
    name: "Dashboard",
    description: "View gym statistics overview",
    path: "/dashboard",
    category: "Dashboard",
    icon: LayoutDashboard,
  },

  // Members
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

  // Attendance
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

  // Payments
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

  // Membership
  {
    name: "Membership Pricing",
    description: "Manage membership plans and prices",
    path: "/settings?filter=pricing",
    category: "Pricing",
    icon: BadgeDollarSign
  },
  {
    name: "Add Membership Plan",
    description: "Create a new membership package",
    path: "/settings?filter=pricing&action=add",
    category: "Membership",
    icon: PlusCircle,
  },

  // Rewards
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

  // Notifications
  {
    name: "Notifications",
    description: "View system notifications",
    path: "/notifications",
    category: "Notifications",
    icon: Bell,
  },
  
  // Account
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
    icon: UserCog,
  }
];

export function Header() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [logout, setLogout] = useState(false);

  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);

    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <header className="h-16 bg-white dark:bg-stone-900 border-b border-slate-100 dark:border-stone-700 flex items-center justify-between px-6 shrink-0 shadow-sm">
      {/* Greetings */ }
      <div>
        <h1 className="text-md font-semibold text-slate-800 dark:text-slate-100">
          Welcome back, Admin!
        </h1>

        <p className="text-sm text-slate-400 dark:text-slate-400">
          Here’s what’s happening in your gym today.
        </p>
      </div>
      
      {/* Search */}
      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={search}
          onFocus={() => setShowSearch(true)}
          onChange={(e) => {
            setSearch(e.target.value);
            setShowSearch(true);
          }}
          className="
            pl-9 pr-4 py-2 
            bg-slate-50 
            dark:bg-stone-800
            border border-slate-200 
            dark:border-stone-700
            rounded-xl 
            text-sm 
            text-slate-700 
            dark:text-slate-200 
            w-100
          "
          placeholder="Search shortcuts..."
        />

        {showSearch && search && (
          <div
            className="
              absolute top-12 left-0 w-100
              h-70
              bg-white
              dark:bg-stone-900
              border border-slate-100
              dark:border-stone-700
              rounded-xl
              shadow-xl
              z-50
              overflow-scroll
            "
          >
            {searchItems
              .filter((item) =>
                item.name
                  .toLowerCase()
                  .includes(search.toLowerCase())
              )
              .map((item) => {
                const Icon = item.icon;
              
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setSearch("");
                      setShowSearch(false);
                    }}
                    className="
                      w-full flex items-center gap-3
                      px-4 py-3
                      hover:bg-slate-50
                      dark:hover:bg-stone-800
                      transition
                      text-left
                    "
                  >
                    {/* ICON */}
                    <div
                      className="
                        w-9 h-9
                        rounded-lg
                        bg-emerald-50
                        dark:bg-emerald-900/30
                        flex
                        items-center
                        justify-center
                        shrink-0
                      "
                    >
                      <Icon
                        size={17}
                        className="
                          text-emerald-600
                          dark:text-emerald-400
                        "
                      />
                    </div>

                    {/* TEXT */}
                    <div className="flex-1">
                      <p
                        className="
                          text-sm 
                          font-medium 
                          text-slate-700
                          dark:text-slate-100
                        "
                      >
                        {item.name}
                      </p>

                      <p
                        className="
                          text-xs 
                          text-slate-400
                          dark:text-slate-500
                        "
                      >
                        {item.description}
                      </p>
                    </div>

                    {/* CATEGORY */}
                    <span
                      className="
                        text-[10px]
                        text-slate-400
                        dark:text-slate-500
                      "
                    >
                      {item.category}
                    </span>
                  </button>
                );
              })}

              {searchItems.filter((item) =>
                item.name
                  .toLowerCase()
                  .includes(search.toLowerCase())
              ).length === 0 && (
                <div
                className="
                    h-full
                    flex
                    items-center
                    justify-center
                    py-8
                  "
                >
                  <p
                    className="
                      text-sm
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    No matching function found.
                  </p>
                </div>
              )}
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Dark Mode Toggle */}
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
            className="data-[state=checked]:bg-stone-700 data-[state=unchecked]:bg-emerald-500"
          />

          <Moon
            size={16}
            className={`transition ${
              darkMode ? "text-indigo-400" : "text-slate-400"
            }`}
          />
        </div>

        {/* Divider */}
        <div className="
          h-6 
          w-px 
          bg-slate-200
          dark:bg-stone-700
        " />

        {/* Admin */}
        <div className="relative flex items-center gap-2.5">
          {/* Avatar */}
          <div className="
            w-8 h-8 
            rounded-full 
            bg-emerald-500 
            flex 
            items-center 
            justify-center
          ">
            <span className="text-white text-xs font-semibold">
              JD
            </span>
          </div>

          {/* NAME trigger */}
          <div className="
            relative 
            group 
            hidden sm:block 
            cursor-pointer
          ">

            <p className="
              text-slate-700
              dark:text-slate-100
              text-sm 
              font-medium 
              leading-none
            ">
              Jhon Doe
            </p>

            <p className="
              text-slate-400
              dark:text-slate-500
              text-xs 
              mt-0.5
            ">
              Administrator
            </p>


            {/* Dropdown */}
            <div
              className="
                absolute 
                right-0 
                mt-2 
                w-52
                bg-white
                dark:bg-stone-900
                border 
                border-slate-100
                dark:border-stone-700
                shadow-xl 
                rounded-xl
                opacity-0 
                invisible
                group-hover:opacity-100 
                group-hover:visible
                transition-all 
                duration-150 
                ease-out
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
                className="
                  w-full 
                  flex 
                  items-center 
                  gap-3 
                  px-4 
                  py-2.5 
                  text-sm
                  text-slate-700
                  dark:text-slate-200
                  hover:bg-slate-50
                  dark:hover:bg-stone-800
                "
              >
                <User 
                  size={16} 
                  className="text-slate-500 dark:text-slate-400" 
                />

                <span>
                  Profile
                </span>

                <ChevronRight 
                  size={14} 
                  className="
                    ml-auto 
                    text-slate-400
                  " 
                />
              </button>


              {/* Settings */}
              <button
                onClick={() => navigate("/settings")}
                className="
                  w-full 
                  flex 
                  items-center 
                  gap-3 
                  px-4 
                  py-2.5 
                  text-sm
                  text-slate-700
                  dark:text-slate-200
                  hover:bg-slate-50
                  dark:hover:bg-stone-800
                "
              >
                <Settings 
                  size={16} 
                  className="text-slate-500 dark:text-slate-400" 
                />

                <span>
                  Settings
                </span>
              </button>


              {/* Divider */}
              <div className="
                h-px 
                bg-slate-100
                dark:bg-stone-700
                my-1
              " />


              {/* Logout */}
              <button
                onClick={() => setLogout(!logout)}
                className="
                  w-full 
                  flex 
                  items-center 
                  gap-3 
                  px-4 
                  py-2.5 
                  text-sm 
                  text-red-500
                  hover:bg-red-50
                  dark:hover:bg-red-900/30
                "
              >
                <LogOut size={16} />

                <span>
                  Logout
                </span>
              </button>

            </div>
          </div>
        </div>
      </div>

      <LogoutConfirmationModal
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