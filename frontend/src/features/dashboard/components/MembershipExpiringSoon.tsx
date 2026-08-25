import { CalendarClock, Clock, UserRound } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ExpiringMembership } from "../types/DashboardTypes";

interface MembershipsExpiringSoonProps {
  data: ExpiringMembership[];
}

export function MembershipsExpiringSoon({
  data,
}: MembershipsExpiringSoonProps) {
  const getExpiryLabel = (days: number) => {
    if (days <= 1) {
      return "Expires tomorrow";
    }

    return `Expires in ${days} days`;
  };

  const getExpiryStyle = (days: number) => {
    if (days <= 1) {
      return {
        container:
          "bg-[#963348]/10 text-[#963348] dark:bg-[#963348]/20",
      };
    }

    if (days <= 3) {
      return {
        container:
          "bg-[#B86A7A]/10 text-[#7A1F31] dark:bg-[#B86A7A]/20 dark:text-[#B86A7A]",
      };
    }

    return {
      container: "bg-muted text-muted-foreground",
    };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Memberships Expiring Soon</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Members whose memberships are about to expire
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#963348]/10 dark:bg-[#963348]/20">
            <CalendarClock className="h-5 w-5 text-[#963348]" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-[350px] space-y-3">
        {data.length > 0 ? (
          data.slice(0, 5).map((membership) => {
            const style = getExpiryStyle(membership.daysRemaining);

            return (
              <div
                key={membership.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#963348]/10 dark:bg-[#963348]/20">
                    <UserRound className="h-4 w-4 text-[#963348]" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">
                      {membership.fullname}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {membership.planName}
                    </p>
                  </div>
                </div>

                <div
                  className={`ml-3 flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${style.container}`}
                >
                  <Clock className="h-3 w-3" />
                  <span>{getExpiryLabel(membership.daysRemaining)}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#963348]/10 dark:bg-[#963348]/20">
              <CalendarClock className="h-6 w-6 text-[#963348]" />
            </div>

            <h3 className="text-sm font-semibold">
              No memberships expiring soon
            </h3>

            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Members with upcoming membership expirations will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}