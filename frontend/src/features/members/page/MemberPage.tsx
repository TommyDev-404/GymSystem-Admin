import { useMemo, useState } from "react";
import { MemberFilters } from "@/features/members/components/MemberFilter";
import { MemberTable } from "@/features/members/components/MemberTable";
import { MemberModal } from "@/features/members/components/MemberModal";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMembers } from "../hooks/useMember";
import { debounce } from "@/lib/debounce";
import { useSearchParams } from "react-router-dom";

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

	const { data: members = [], isLoading } = useMembers(params);

	return (
		<div className="space-y-5">
			{/* HEADER */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-slate-800 font-bold text-xl">Members</h1>
					<p className="text-slate-500 text-sm mt-0.5">
						Manage members registration
					</p>
				</div>

				<Button
					className="bg-emerald-500 py-5 px-3 hover:bg-emerald-600"
					onClick={() => setOpen(true)}
				>
					<Plus size={14} />
					Add Member
				</Button>
			</div>

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
			<MemberTable members={members} isLoading={isLoading}/>

			{/* MODAL */}
			<MemberModal open={open} setOpen={setOpen} />
		</div>
	);
 }