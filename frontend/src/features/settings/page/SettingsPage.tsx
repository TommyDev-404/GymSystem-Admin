import { useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import { SettingsHeader } from "@/features/settings/components/SettingsHeader";
import { SettingsSidebar } from "@/features/settings//components/SettingsSidebar";
import { PricingSection } from "@/features/settings/sections/membership_plans/page/PricingSection";
import { SecuritySection } from "@/features/settings/sections/security/page/SecuritySection";
import { AdminProfileSection } from "../sections/admin-info/page/AdminProfileSection";

export function SettingsPage() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
	
  const urlFilter = searchParams.get("filter") || location.state?.active;

  const [active, setActive] = useState(urlFilter || "profile");

  return (
    <div className="space-y-5">
      <SettingsHeader />

      <div className="flex gap-5">
        <SettingsSidebar active={active} setActive={setActive} />

        <div className="flex-1 space-y-4">
          {active === "pricing" && <PricingSection/>}
          {active === "security" &&<SecuritySection/>}  
          {active === "profile" &&  <AdminProfileSection />}
        </div>
      </div>
    </div>
  );
}