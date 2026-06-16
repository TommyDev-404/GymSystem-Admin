import { useState } from "react";
import { useLocation } from "react-router-dom";

import { SettingsHeader } from "@/features/settings/components/SettingsHeader";
import { SettingsSidebar } from "@/features/settings//components/SettingsSidebar";
import { GymSection } from "@/features/settings/components/sections/GymSection";
import { PricingSection } from "@/features/settings/components/sections/PricingSection";
import { NotificationsSection } from "@/features/settings/components/sections/NotificationsSection";
import { SecuritySection } from "@/features/settings/components/sections/SecuritySection";
import { AdminProfileSection } from "../components/sections/AdminProfileSection";

const initialPlans = [
   {
     id: "basic",
     label: "Basic Plan",
     value: 45,
     color: "border-slate-200",
     badge: "bg-slate-100 text-slate-600",
   },
   {
     id: "premium",
     label: "Premium Plan",
     value: 89,
     color: "border-indigo-200",
     badge: "bg-indigo-100 text-indigo-700",
   },
   {
     id: "elite",
     label: "Elite Plan",
     value: 139,
     color: "border-amber-200",
     badge: "bg-amber-100 text-amber-700",
   },
 ];

const notificationItems = [
   {
     id: "payment",
     label: "Payment Alerts",
     desc: "Get notified for overdue and received payments",
     value: true,
   },
   {
     id: "expiry",
     label: "Membership Expiry",
     desc: "Alerts 7 days before membership expires",
     value: true,
   },
   {
     id: "checkin",
     label: "Member Check-Ins",
     desc: "Notify on each member check-in",
     value: false,
   },
   {
     id: "reward",
     label: "Reward Activity",
     desc: "Notifications when rewards are claimed",
     value: true,
   },
];
 
const MEMBERSHIP_TYPES = [
  "Walk-in",
  "Monthly",
  "Quarterly",
  "Semi-Annual",
  "Yearly",
  "Student Plan",
  "Promo Plan",
];


export function SettingsPage() {
  const location = useLocation();

  const [active, setActive] = useState(location.state?.active || "gym");
  const [saved, setSaved] = useState(false);
  const [plans, setPlans] = useState(initialPlans);
  const [items, setItems] = useState(notificationItems);
  const [twoFactor, setTwoFactor] = useState(false);
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleChangePrice = (id: string, value: number) => {
    setPlans((prev) =>
        prev.map((p) => (p.id === id ? { ...p, value } : p))
    );
  };
    
  const handleChangeNotif = (id: string, value: boolean) => {
    setItems((prev) =>
        prev.map((n) => (n.id === id ? { ...n, value } : n))
    );
  };

  
  return (
    <div className="space-y-5">
      <SettingsHeader saved={saved} onSave={handleSave} />

      <div className="flex gap-5">
        <SettingsSidebar active={active} setActive={setActive} />

        <div className="flex-1 space-y-4">
          {active === "gym" && <GymSection membershipTypes={MEMBERSHIP_TYPES} />}
          {active === "pricing" && <PricingSection plans={initialPlans} onChange={handleChangePrice}/>}
          {active === "notifications" &&  <NotificationsSection items={items} onChange={handleChangeNotif} />}
          {active === "security" &&
              <SecuritySection
                twoFactor={twoFactor}
                setTwoFactor={setTwoFactor}
                form={securityForm}
                setForm={setSecurityForm}
              />
          }  
          {active === "profile" &&  <AdminProfileSection />}
          
        </div>
      </div>
    </div>
  );
}