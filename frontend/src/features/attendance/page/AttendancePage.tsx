import { useState } from "react";

import { AttendanceTable } from "@/features/attendance/components/AttendanceTable";
import { QRCodeModal } from "@/features/attendance/components/QRCodeModal";

import { useGetMemberAttendance, useTodayQr } from "@/features/attendance/hooks/useAttendance";
import { AttendanceFilter } from "../components/AttendanceFilter";
import type { Filters } from "../types/AttendanceTypes";
import { useSearchParams } from "react-router-dom";
import { QrCodeIcon } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

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

			<PageHeader
				title="Attendance"
				subtitle="Track member check-ins and weekly stats"
				icon={QrCodeIcon}
				setOpen={() => setQrOpen(true)}
				actionName="Generate QR Code"
			/>
		
			<AttendanceFilter
				filters={filters}
				setFilters={setFilters}
			/>

			<AttendanceTable
				members={memberAttendance}
				isLoading={attendanceLoading}
			/>

			<QRCodeModal
				open={qrOpen}
				setOpen={setQrOpen}
				qr={data?.qr}
				loading={qrCodeLoading}
			/>
		</div>
	);
}