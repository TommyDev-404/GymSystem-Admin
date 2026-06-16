import { useState } from "react";

import { ReportsHeader } from "@/features/reports/components/ReportsHeader";
import { ReportsControls } from "@/features/reports/components/ReportsControls";
import { ReportsTable } from "@/features/reports/components/ReportsTable";

const attendanceReport = [
   { date: "2026-06-09", total: 87, members: 71, guests: 16, peak: "07:00–09:00" },
   { date: "2026-06-08", total: 203, members: 178, guests: 25, peak: "06:00–08:00" },
   { date: "2026-06-07", total: 89, members: 79, guests: 10, peak: "08:00–10:00" },
 ];
 
 const paymentReport = [
   { date: "2026-06-08", member: "Priya Patel", plan: "Elite", amount: 139, method: "Card" },
   { date: "2026-06-07", member: "Luca Ferrari", plan: "Elite", amount: 139, method: "Bank" },
 ];
 
 const memberReport = [
   { joined: "2026-06-01", name: "Zoe Kim", plan: "Basic", status: "Active", age: 24 },
   { joined: "2026-05-18", name: "Aisha Diallo", plan: "Premium", status: "Active", age: 29 },
 ];
 

export function ReportsPage() {
  const [activeReport, setActiveReport] = useState("Attendance");
  const [dateFrom, setDateFrom] = useState("2026-06-01");
  const [dateTo, setDateTo] = useState("2026-06-09");

  return (
    <div className="space-y-5">
      <ReportsHeader />

      <ReportsControls
        activeReport={activeReport}
        setActiveReport={setActiveReport}
        dateFrom={dateFrom}
        dateTo={dateTo}
        setDateFrom={setDateFrom}
        setDateTo={setDateTo}
      />

      <ReportsTable
        activeReport={activeReport}
        attendanceReport={attendanceReport}
        paymentReport={paymentReport}
        memberReport={memberReport}
      />
    </div>
  );
}