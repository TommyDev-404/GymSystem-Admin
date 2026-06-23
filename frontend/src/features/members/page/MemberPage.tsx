import { useMemo, useState } from "react";
import { MemberFilters } from "@/features/members/components/MemberFilter";
import { MemberTable } from "@/features/members/components/MemberTable";
import { MemberModal } from "@/features/members/components/MemberModal";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMembers } from "../hooks/useMember";
import { Loading } from "@/components/shared/PageLoading";

export function MembersPage() {
   const [search, setSearch] = useState("");
   const [gender, setGender] = useState("All");
   const [status, setStatus] = useState("All");
 
   const [open, setOpen] = useState(false);
 
   /* ---------------- QUERY PARAMS ---------------- */
   const params = useMemo(() => ({
    search: search || undefined,
    gender: gender !== "All" ? gender : undefined,
    status: status !== "All" ? status : undefined,
   }), [search, gender, status]);
 
   const { data: members = [], isLoading } = useMembers(params);
 
  if (isLoading) return <Loading />;

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
         search={search}
         setSearch={setSearch}
         gender={gender}
         setGender={setGender}
         status={status}
         setStatus={setStatus}
       />
 
       {/* TABLE */}
       <MemberTable members={members} />
 
       {/* MODAL */}
       <MemberModal open={open} setOpen={setOpen} />
     </div>
   );
 }