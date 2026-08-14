import { useState } from "react";
import { Button } from "@/components/ui/button";

import { AttendanceTable } from "@/features/attendance/components/AttendanceTable";
import { QRCodeModal } from "@/features/attendance/components/QRCodeModal";

import { useGetMemberAttendance, useTodayQr } from "@/features/attendance/hooks/useAttendance";
import { AttendanceFilter } from "../components/AttendanceFilter";
import type { Filters } from "../types/AttendanceTypes";
import { useSearchParams } from "react-router-dom";
import { QrCodeIcon } from "lucide-react";

export function AttendancePage() {
	const [searchParams] = useSearchParams();
	
	const urlFilter = searchParams.get("filter");
	const urlAction = searchParams.get("action");

  const [qrOpen, setQrOpen] = useState(urlAction === "generate" ? true : false);
  const [filters, setFilters] = useState<Filters>({
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: urlFilter !== "history" ? new Date().getDate() : undefined,
  });

  const { data, isLoading: qrCodeLoading } = useTodayQr();
  const { data: memberAttendance = [], isLoading: attendanceLoading } = useGetMemberAttendance(filters);
  
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
        <Button
					className="
						bg-emerald-500
						dark:bg-emerald-600
						py-5
						px-3
						hover:bg-emerald-600
						dark:hover:bg-emerald-700
						text-white
					"
          onClick={() => setQrOpen(true)}
        >
          <QrCodeIcon />
          Generate QR Code
        </Button>
      </div>
      
      <AttendanceFilter
        filters={filters}
        setFilters={setFilters}
      />
      
      {/* TABLE */}
      <AttendanceTable
        members={memberAttendance}
        isLoading={attendanceLoading}
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