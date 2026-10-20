
type EngagementStatus =
  | "ACTIVE"
  | "AT_RISK"
  | "INACTIVE"
  | "NO_ATTENDANCE";

export const getEngagementStatus = (lastAttendance: Date | null): EngagementStatus => {
  if (!lastAttendance) {
    return "NO_ATTENDANCE";
  }

  const today = new Date();
  const todayStart = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );

  const visitDate = new Date(lastAttendance);

  if (Number.isNaN(visitDate.getTime())) {
    return "NO_ATTENDANCE";
  }

  const visitStart = new Date(
    visitDate.getFullYear(),
    visitDate.getMonth(),
    visitDate.getDate(),
  );

  const daysSinceVisit = Math.floor(
    (todayStart.getTime() - visitStart.getTime()) /
      (1000 * 60 * 60 * 24),
  );

  if (daysSinceVisit < 0) {
    return "NO_ATTENDANCE";
  }

  if (daysSinceVisit <= 7) return "ACTIVE";
  if (daysSinceVisit <= 12) return "AT_RISK";

  return "INACTIVE";
};