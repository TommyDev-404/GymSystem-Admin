import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import { AttendanceTable } from "@/features/attendance/components/AttendanceTable";
import { QRCodeModal } from "@/features/attendance/components/QRCodeModal";

import { useGetMemberAttendance, useTodayQr } from "@/features/attendance/hooks/useAttendance";
import { AttendanceFilter } from "../components/AttendanceFilter";
import type { Filters } from "../types/AttendanceTypes";
import { useSocket } from "@/context/SocketContext";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";

export function AttendancePage() {
  const socket = useSocket();
  const queryClient = useQueryClient();
  
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
  
  useEffect(() => {
    const handleNewAttendance = () => {
      queryClient.invalidateQueries({
        queryKey: ["attendance"],
      });
  
      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary-data"],
      });
  
      queryClient.invalidateQueries({
        queryKey: ["dashboard-weekly-attendance"],
      });
  
      queryClient.invalidateQueries({
        queryKey: ["dashboard-recent-activity"],
      });
    };
  
    socket.on(
      "attendance:new",
      handleNewAttendance
    );
  
    return () => {
      socket.off(
        "attendance:new",
        handleNewAttendance
      );
    };
  }, [socket, queryClient]);
      
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