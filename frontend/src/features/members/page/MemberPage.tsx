import { useMemo, useState } from "react";
import { MemberFilters } from "@/features/members/components/MemberFilter";
import { MemberTable } from "@/features/members/components/MemberTable";
import { MemberModal } from "@/features/members/components/MemberModal";
import { useMembersSummary } from "../hooks/useMember";
import { debounce } from "@/lib/debounce";
import { useSearchParams } from "react-router-dom";
import { MemberSummaryCards } from "../components/MemberSummaryCards";
import type { MemberSummaryType } from "../types/member";
import { PageLoader } from "@/components/shared/PageLoader";
import PageHeader from "@/components/shared/PageHeader";
import { Plus } from "lucide-react";

export function MembersPage() {
	const [searchParams] = useSearchParams();
	
	const urlFilter = searchParams.get("filter");
	const urlAction = searchParams.get("action");

	const [searchInput, setSearchInput] = useState("");
	const [search, setSearch] = useState("");
	const [gender, setGender] = useState("All");
	const [status, setStatus] = useState(urlFilter || "All");
	const [open, setOpen] = useState(urlAction  && urlAction === "add"? true : false);
	
	const debounceSearch = useMemo(
		() =>
		  debounce((value: string) => {
			 setSearch(value);
		  }),
		[]
	 );

	const params = useMemo(() => ({
		search: search || undefined,
		gender: gender !== "All" ? gender : undefined,
		status: status !== "All" ? status : undefined,
	}), [search, gender, status]);

	const { data: memberSummary = {} as MemberSummaryType, isLoading: summaryLoading } = useMembersSummary();

	if (summaryLoading) return <PageLoader />;

	return (
		<div className="space-y-5">
			{/* HEADER */}
			<PageHeader
				title="Member"
				subtitle="Manage members registration"
				icon={Plus}
				setOpen={() => setOpen(true)}
				actionName="Add Member"
			/>

			<MemberSummaryCards
				summary={memberSummary}
			/>
			
			{/* FILTERS */}
			<MemberFilters
				search={searchInput}
				setSearch={(value) => {
					setSearchInput(value);
					debounceSearch(value);
				}}
				gender={gender}
				setGender={setGender}
				status={status}
				setStatus={setStatus}
			/>

			{/* TABLE */}
			<MemberTable params={params}/>

			{/* MODAL */}
			<MemberModal open={open} setOpen={setOpen} />
		</div>
	);
 }