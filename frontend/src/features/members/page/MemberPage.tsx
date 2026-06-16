import { useState } from "react";
import type { Member } from "@/features/members/types/member";
import { MemberFilters } from "@/features/members/components/MemberFilter";
import { MemberTable } from "@/features/members/components/MemberTable";
import { AddMemberModal } from "@/features/members/components/AddMemberModal";
import { Plus } from "lucide-react";

const initialMembers: Member[] = [
   { id: 1, name: "Sarah Johnson", age: 28, gender: "Female", bmi: 22.4, status: "Active", plan: "Premium", joined: "2025-01-15", avatar: "SJ" },
   { id: 2, name: "Mike Chen", age: 34, gender: "Male", bmi: 24.1, status: "Active", plan: "Basic", joined: "2025-03-02", avatar: "MC" },
   { id: 3, name: "Emma Davis", age: 26, gender: "Female", bmi: 21.8, status: "Active", plan: "Premium", joined: "2025-02-20", avatar: "ED" },
];
 
export function MembersPage() {
   const [members, setMembers] = useState<Member[]>(initialMembers);

   const [search, setSearch] = useState("");
   const [gender, setGender] = useState("All");
   const [status, setStatus] = useState("All");

   const [open, setOpen] = useState(false);
   const [form, setForm] = useState<any>({});

   const filtered = members.filter((m) => {
      return (
         m.name.toLowerCase().includes(search.toLowerCase()) &&
         (gender === "All" || m.gender === gender) &&
         (status === "All" || m.status === status)
      );
   });

   return (
      <div className="space-y-5">
         <div className="flex items-center justify-between">
            <div>
               <h1 className="text-slate-800 font-bold text-xl">Members</h1>
               <p className="text-slate-500 text-sm mt-0.5">{members.length} total members registered</p>
            </div>
            <button
               onClick={() => setOpen(true)}
               className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
               <Plus size={15} />
               Add Member
            </button>
         </div>
         
         <MemberFilters
            search={search}
            setSearch={setSearch}
            gender={gender}
            setGender={setGender}
            status={status}
            setStatus={setStatus}
         />

         <MemberTable
            members={filtered}
            onEdit={(m) => {
               setForm(m);
               setOpen(true);
            }}
            onDelete={(id) =>
               setMembers((prev) => prev.filter((m) => m.id !== id))
            }
         />

         <AddMemberModal
            open={open}
            setOpen={setOpen}
            form={form}
            setForm={setForm}
            onSave={() => {
               setMembers((prev) => [...prev]);
               setOpen(false);
            }}
         />
      </div>
   );
}