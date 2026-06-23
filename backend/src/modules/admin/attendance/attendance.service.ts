import { AttendanceRepository } from "./attendance.repository";

export const getAttendanceService = async (filters: {
  year?: number;
  month?: number;
  day?: number;
}) => {
  const { year, month, day } = filters;

  const start = new Date();
  const end = new Date();

  // 📅 YEAR filter
  if (year && !month && !day) {
    start.setFullYear(year, 0, 1);
    start.setHours(0, 0, 0, 0);

    end.setFullYear(year, 11, 31);
    end.setHours(23, 59, 59, 999);
  }

  // 📅 MONTH filter
  else if (year && month && !day) {
    start.setFullYear(year, month - 1, 1);
    start.setHours(0, 0, 0, 0);

    end.setFullYear(year, month, 0);
    end.setHours(23, 59, 59, 999);
  }

  // 📅 DAY filter
  else if (year && month && day) {
    start.setFullYear(year, month - 1, day);
    start.setHours(0, 0, 0, 0);

    end.setFullYear(year, month - 1, day);
    end.setHours(23, 59, 59, 999);
  }

  // 📌 DEFAULT: today
  else {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }

  return AttendanceRepository.getByDateRange(start, end);
};