import { Search, Filter } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  search: string;
  setSearch: (v: string) => void;
  engagementStatus: string;
  setEngagementStatus: (v: string) => void;
  membershipStatus: string;
  setMembershipStatus: (v: string) => void;
}

export function MemberFilters({
  search,
  setSearch,
  engagementStatus,
  setEngagementStatus,
  membershipStatus,
  setMembershipStatus,
}: Props) {
  return (
    <Card className="rounded-2xl border border-stone-200 shadow-sm dark:border-stone-700">
      <div className="flex flex-wrap items-center gap-4 px-4">
        <div className="relative min-w-[260px] flex-1">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
          />

          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members..."
            className="h-11 rounded-xl border-stone-200 bg-slate-50 pl-10 text-slate-700 shadow-none placeholder:text-slate-400 focus-visible:border-emerald-500 focus-visible:ring-2 focus-visible:ring-emerald-500 dark:border-stone-700 dark:text-slate-200 dark:placeholder:text-slate-500"
          />
        </div>

        <Separator
          orientation="vertical"
          className="hidden h-12 dark:bg-stone-700 lg:block"
        />

        <div className="hidden items-center gap-2 text-slate-500 dark:text-slate-400 md:flex">
          <Filter size={17} />
          <span className="text-sm font-medium">Filters</span>
        </div>
        
        <Select value={membershipStatus} onValueChange={setMembershipStatus}>
          <SelectTrigger className="h-11 w-[200px] border-slate-200 text-slate-700 dark:border-stone-700 dark:text-slate-200">
            <SelectValue placeholder="Membership Status" />
          </SelectTrigger>

          <SelectContent className="border-slate-200 dark:border-stone-700">
            <SelectItem value="All">All Membership Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Expired">Expired</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={engagementStatus} onValueChange={setEngagementStatus}>
          <SelectTrigger className="h-11 w-[200px] border-slate-200 text-slate-700 dark:border-stone-700 dark:text-slate-200">
            <SelectValue placeholder="Engagement Status" />
          </SelectTrigger>

          <SelectContent className="border-slate-200 dark:border-stone-700">
            <SelectItem value="All">All Engagement Status</SelectItem>
            <SelectItem value="ACTIVE">Active</SelectItem>
            <SelectItem value="AT_RISK">At Risk</SelectItem>
            <SelectItem value="INACTIVE">Inactive</SelectItem>
            <SelectItem value="NO_ATTENDANCE">No Attendance Yet</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </Card>
  );
}