import { useState } from "react";
import { useLocation } from "react-router-dom";

import { SettingsHeader } from "@/features/settings/components/SettingsHeader";
import { SettingsSidebar } from "@/features/settings//components/SettingsSidebar";
import { PricingSection } from "@/features/settings/sections/membership_plans/page/PricingSection";
import { SecuritySection } from "@/features/settings/sections/security/page/SecuritySection";
import { AdminProfileSection } from "../sections/admin-info/page/AdminProfileSection";

export function SettingsPage() {
  const location = useLocation();

  const [active, setActive] = useState(location.state?.active || "profile");
  const [twoFactor, setTwoFactor] = useState(false);
  const [securityForm, setSecurityForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  return (
    <div className="space-y-5">
      <SettingsHeader />

      <div className="flex gap-5">
        <SettingsSidebar active={active} setActive={setActive} />

        <div className="flex-1 space-y-4">
          {active === "pricing" && <PricingSection/>}
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