import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Plus } from "lucide-react";

import { MemberFilters } from "@/features/members/components/MemberFilter";
import { MemberTable } from "@/features/members/components/MemberTable";
import { MemberModal } from "@/features/members/components/MemberModal";
import { MemberSummaryCards } from "../components/MemberSummaryCards";
import { useMembersSummary } from "../hooks/useMember";
import type { MemberSummaryType } from "../types/member";
import { debounce } from "@/lib/debounce";
import { PageLoader } from "@/components/shared/PageLoader";
import PageHeader from "@/components/shared/PageHeader";

export function MembersPage() {
  const [searchParams] = useSearchParams();

  const urlFilter = searchParams.get("filter");
  const urlAction = searchParams.get("action");

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [engagementStatus, setEngagementStatus] = useState("All");
  const [membershipStatus, setMembershipStatus] = useState(
    urlFilter || "All",
  );
  const [open, setOpen] = useState(urlAction === "add");

  const debounceSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearch(value);
      }),
    [],
  );

  const params = useMemo(
    () => ({
      search: search || undefined,
      engagementStatus:
        engagementStatus !== "All" ? engagementStatus : undefined,
      membershipStatus:
        membershipStatus !== "All" ? membershipStatus : undefined,
    }),
    [search, engagementStatus, membershipStatus],
  );

  const {
    data: memberSummary = {} as MemberSummaryType,
    isLoading: summaryLoading,
  } = useMembersSummary();

  if (summaryLoading) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Members"
        subtitle="Manage member registrations and engagement"
        icon={Plus}
        setOpen={() => setOpen(true)}
        actionName="Add Member"
      />

      <MemberSummaryCards summary={memberSummary} />

      <MemberFilters
        search={searchInput}
        setSearch={(value) => {
          setSearchInput(value);
          debounceSearch(value);
        }}
        engagementStatus={engagementStatus}
        setEngagementStatus={setEngagementStatus}
        membershipStatus={membershipStatus}
        setMembershipStatus={setMembershipStatus}
      />

      <MemberTable params={params} />

      <MemberModal open={open} setOpen={setOpen} />
    </div>
  );
}