import { Badge } from "@/components/ui/badge";
import type { Attendance } from "../types/AttendanceTypes";
import { getInitials } from "@/utils/initials";
import { TableLoader } from "@/components/shared/TableLoader";

type Props = {
  members: Attendance[];
  isLoading: boolean;
};

export function AttendanceTable({ members, isLoading }: Props) {
   const TH_CLASS = "text-left text-slate-500 font-medium px-5 py-3.5";

   const formatPhilippineTime = (date: string) => {
      return new Intl.DateTimeFormat("en-PH", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date(date));
    };

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b">
            <th className={TH_CLASS}>Name</th>
            <th className={TH_CLASS}>Gender</th>
            <th className={TH_CLASS}>Check-in Time</th>
            <th className={TH_CLASS}>Plan</th>
            <th className={TH_CLASS}>Status</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {isLoading ? (
            <TableLoader/>
          ) : members.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                className="text-center py-10 text-slate-400"
              >
                No attendance found
              </td>
            </tr>
          ) : (
            members.map((m, index) => (
              <tr
                key={index}
                className="hover:bg-slate-50 transition"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-700 text-xs font-semibold uppercase">
                        {getInitials(m.name)}
                      </span>
                    </div>

                    <span className="font-medium text-slate-700">
                      {m.name}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {m.gender ?? "N/A"}
                </td>

                <td className="px-5 py-4 text-slate-600">
                  {formatPhilippineTime(m.checkin_time)}
               </td>

                <td className="px-5 py-4">
                  <Badge className="bg-indigo-100 text-indigo-700">
                    {m.plan ?? "No Plan"}
                  </Badge>
                </td>

                <td className="px-5 py-4">
                  <Badge className="bg-emerald-100 text-emerald-700">
                    Present
                  </Badge>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}