import { useState } from "react";
import { Button } from "@/components/ui/button";

import { PresentMembersTable } from "@/features/attendance/components/PresentMembersTable";
import { QRCodeModal } from "@/features/attendance/components/QRCodeModal";

import { useTodayQr } from "@/features/attendance/hooks/useQRCode";

const presentMembers = [
  { id: 1, name: "Sarah Johnson", avatar: "SJ", checkIn: "06:32 AM", duration: "2h 14m", plan: "Premium" },
  { id: 2, name: "Emma Davis", avatar: "ED", checkIn: "07:01 AM", duration: "1h 45m", plan: "Premium" },
  { id: 3, name: "Aisha Diallo", avatar: "AD", checkIn: "07:15 AM", duration: "1h 31m", plan: "Premium" },
  { id: 4, name: "Luca Ferrari", avatar: "LF", checkIn: "08:05 AM", duration: "41m", plan: "Elite" },
  { id: 5, name: "Zoe Kim", avatar: "ZK", checkIn: "08:22 AM", duration: "24m", plan: "Basic" },
];

export function AttendancePage() {
  const [search, setSearch] = useState("");
  const [qrOpen, setQrOpen] = useState(false);

  const { data, isLoading: qrCodeLoading } = useTodayQr();
  console.log(data);

  const filtered = presentMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-xl">Attendance</h1>
          <p className="text-slate-500 text-sm">
            Track member check-ins and weekly stats
          </p>
        </div>

        {/* BUTTON */}
        <Button onClick={() => setQrOpen(true)}>
          Generate QR Code
        </Button>
      </div>
      
      {/* TABLE */}
      <PresentMembersTable
        members={filtered}
        search={search}
        setSearch={setSearch}
      />

      {/* MODAL */}
      <QRCodeModal
        open={qrOpen}
        setOpen={setQrOpen}
        qr={data?.qr}
        loading={qrCodeLoading}
      />
    </div>
  );
}