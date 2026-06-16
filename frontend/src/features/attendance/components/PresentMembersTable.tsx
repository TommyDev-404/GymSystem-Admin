import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

export function PresentMembersTable({
  members,
  search,
  setSearch,
}: any) {
  const TH_CLASS =
    "text-left text-slate-500 font-medium px-5 py-3.5";

  const today = new Date();

  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  const [day, setDay] = useState(currentDay);
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const [disableDayFilter, setDisableDayFilter] = useState(false);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const months = [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];

  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

      {/* HEADER */}
      <div className="p-5 border-b space-y-4">

        {/* TITLE + SEARCH */}
        <div className="flex items-center justify-between">
          <h3 className="font-medium">
            Today’s Attendance ({members.length})
          </h3>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
            <Input
              className="pl-8 w-52"
              placeholder="Search member..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-4 gap-4 items-end">

          {/* MONTH */}
          <div className="space-y-1">
            <label className="text-xs text-slate-500">
              Month
            </label>
            <select
              className="border rounded-md px-3 py-2 text-sm text-slate-600 w-full"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>

          {/* YEAR */}
          <div className="space-y-1">
            <label className="text-xs text-slate-500">
              Year
            </label>
            <select
              className="border rounded-md px-3 py-2 text-sm text-slate-600 w-full"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* DAY */}
          <div className="space-y-1">
            <label className="text-xs text-slate-500">
              Day
            </label>
            <select
              className="border rounded-md px-3 py-2 text-sm text-slate-600 w-full disabled:bg-slate-100"
              value={day}
              onChange={(e) => setDay(Number(e.target.value))}
              disabled={disableDayFilter}
            >
              {days.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* TOGGLE */}
          <div className="flex items-center gap-2 pb-1">
            <input
              type="checkbox"
              id="disableDay"
              checked={disableDayFilter}
              onChange={(e) =>
                setDisableDayFilter(e.target.checked)
              }
              className="w-4 h-4"
            />
            <label
              htmlFor="disableDay"
              className="text-sm text-slate-600"
            >
              Disable Day Filter
            </label>
          </div>

        </div>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-100">
            <th className={TH_CLASS}>Name</th>
            <th className={TH_CLASS}>Gender</th>
            <th className={TH_CLASS}>Check-in Time</th>
            <th className={TH_CLASS}>Plan</th>
            <th className={TH_CLASS}>Status</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {members.map((m: any) => (
            <tr key={m.id} className="hover:bg-slate-50 transition">

              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-emerald-700 text-xs font-semibold uppercase">
                      {m.name?.charAt(0)}
                    </span>
                  </div>

                  <span className="font-medium text-slate-700">
                    {m.name}
                  </span>
                </div>
              </td>

              <td className="px-5 py-4 text-slate-600">
                {m.gender || "Male"}
              </td>

              <td className="px-5 py-4 text-slate-600">
                {m.checkIn}
              </td>

              <td className="px-5 py-4">
                <Badge className="bg-indigo-100 text-indigo-700">
                  {m.plan}
                </Badge>
              </td>

              <td className="px-5 py-4">
                <Badge className="bg-emerald-100 text-emerald-700">
                  Present Today
                </Badge>
              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}