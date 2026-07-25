import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Attendance } from "../types/AttendanceTypes";
import { getInitials } from "@/utils/initials";
import { TableLoader } from "@/components/shared/TableLoader";

type Props = {
  members: Attendance[];
  isLoading: boolean;
};

export function AttendanceTable({ members, isLoading }: Props) {
  const formatPhilippineTime = (date: string) => {
    return new Intl.DateTimeFormat("en-PH", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(date));
  };

  return (
    <Card className="rounded-2xl shadow-sm overflow-hidden p-0">
      <CardContent className="p-0">
      <Table className="text-sm">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left text-slate-500 font-medium px-5 py-3.5 h-auto">
              Name
            </TableHead>
            <TableHead className="text-left text-slate-500 font-medium px-5 py-3.5 h-auto">
              Gender
            </TableHead>
            <TableHead className="text-left text-slate-500 font-medium px-5 py-3.5 h-auto">
              Check-in Time
            </TableHead>
            <TableHead className="text-left text-slate-500 font-medium px-5 py-3.5 h-auto">
              Plan
            </TableHead>
            <TableHead className="text-left text-slate-500 font-medium px-5 py-3.5 h-auto">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableLoader />
          ) : members.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center py-10 text-slate-400"
              >
                No attendance found
              </TableCell>
            </TableRow>
          ) : (
            members.map((m, index) => (
              <TableRow key={index} className="hover:bg-slate-50 transition">
                <TableCell className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-9 h-9 bg-emerald-100">
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase">
                        {getInitials(m.name)}
                      </AvatarFallback>
                    </Avatar>

                    <span className="font-medium text-slate-700">
                      {m.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-5 py-4 text-slate-600">
                  {m.gender ?? "N/A"}
                </TableCell>

                <TableCell className="px-5 py-4 text-slate-600">
                  {formatPhilippineTime(m.checkin_time)}
                </TableCell>

                <TableCell className="px-5 py-4">
                  <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                    {m.plan ?? "No Plan"}
                  </Badge>
                </TableCell>

                <TableCell className="px-5 py-4">
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                    Present
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      </CardContent>
    </Card>
  );
}