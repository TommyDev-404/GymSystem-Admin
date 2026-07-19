import { CalendarDays } from "lucide-react";
import { useState } from "react";
import type { Filters } from "../types/AttendanceTypes";

type Props = {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
};

export function AttendanceFilter({ filters, setFilters }: Props) {
  const currentYear = new Date().getFullYear();

  const [disableDayFilter, setDisableDayFilter] =
    useState(false);

  const days = Array.from(
    { length: 31 },
    (_, i) => i + 1
  );

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => currentYear - i
  );

  const updateFilter = (
    key: keyof Filters,
    value: number
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="bg-white border rounded-2xl p-5 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* MONTH */}
        <FilterSelect
          label="Month"
          value={filters.month}
          options={months.map((m, i) => ({
            value: i + 1,
            label: m,
          }))}
          onChange={(v) =>
            updateFilter("month", v)
          }
           />
           
        {/* YEAR */}
        <FilterSelect
          label="Year"
          value={filters.year}
          options={years.map((y) => ({
            value: y,
            label: y.toString(),
          }))}
          onChange={(v) =>
            updateFilter("year", v)
          }
        />

        {/* DAY */}
        <FilterSelect
          label="Day"
          value={filters.day}
          disabled={disableDayFilter}
          options={days.map((d) => ({
            value: d,
            label: d.toString(),
          }))}
          onChange={(v) =>
            updateFilter("day", v)
          }
        />

        {/* TOGGLE */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={() => {
              const checked =
                !disableDayFilter;

              setDisableDayFilter(checked);

              setFilters((prev) => ({
                ...prev,
                day: checked
                  ? undefined
                  : new Date().getDate(),
              }));
            }}
            className="flex items-center gap-3"
          >

            <div
              className={`
                w-11 h-6 rounded-full transition
                ${
                  disableDayFilter
                    ? "bg-slate-300"
                    : "bg-emerald-500"
                }
              `}
            >

              <div
                className={`
                  w-5 h-5 bg-white rounded-full mt-0.5 transition
                  ${
                    disableDayFilter
                      ? "translate-x-0.5"
                      : "translate-x-5"
                  }
                `}
              />

            </div>


            <span className="text-sm text-slate-600">
              All days
            </span>

          </button>

        </div>
      </div>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
  disabled,
}: {
  label: string;
  value?: number;
  options: {
    value: number;
    label: string;
  }[];
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2">

      <label className="text-xs font-medium text-slate-500 flex items-center gap-1">
        <CalendarDays size={13} />
        {label}
      </label>


      <select
        disabled={disabled}
        value={value}
        onChange={(e) =>
          onChange(Number(e.target.value))
        }
        className="
          w-full rounded-xl border
          px-3 py-2.5
          text-sm text-slate-700
          bg-slate-50
          outline-none
          transition
          focus:ring-2
          focus:ring-emerald-200
          disabled:opacity-50
        "
      >
        {options.map((item) => (
          <option
            key={item.value}
            value={item.value}
          >
            {item.label}
          </option>
        ))}

      </select>

    </div>
  );
}