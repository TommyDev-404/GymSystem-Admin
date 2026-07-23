import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Member } from "@/features/members/types/member";
import { Edit, Mail } from "lucide-react";
import { ResendActivationModal } from "./ResendActivationModal";
import { MemberModal } from "./MemberModal"; // 👈 ADD THIS
import { getInitials } from "@/utils/initials";
import { useUpdateMemberStatus } from "../hooks/useMember";
import { toast } from "sonner";
import { TableLoader } from "@/components/shared/TableLoader";

const planColors: Record<string, string> = {
  Basic: "bg-slate-100 text-slate-600",
  Premium: "bg-indigo-100 text-indigo-700",
  Elite: "bg-amber-100 text-amber-700",
};

const statusColors: Record<string, string> = {
  Active: "bg-emerald-100 text-emerald-700 border-emerald-200",
  Inactive: "bg-slate-100 text-slate-600 border-slate-200",
  Suspended: "bg-red-100 text-red-600 border-red-200",
};

const TH_CLASS = "px-4 py-3 text-slate-500 font-medium text-left";
const TD_CLASS = "px-4 py-3 text-slate-600 text-left";


export function MemberTable({ members, isLoading }: { members: Member[], isLoading: boolean }) {
  const { mutate: updateStatus } = useUpdateMemberStatus();
  const [resendMember, setResendMember] = useState<Member | null>(null);

  /* ---------------- MEMBER MODAL STATE ---------------- */
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  /* ---------------- EDIT HANDLER ---------------- */
  const handleEdit = (member: Member) => {
    setSelectedMember(member);

    setOpenMemberModal(true);
  };

  const handleStatusChange = async (id: number, status: string) => {
    updateStatus({id, data: { status }}, {
      onSuccess: () => {
        toast.success("Status updated successfully.")
      }
    })
  };

  return (
    <>
      {/* TABLE */}
      <div className="bg-white border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">

          <thead className="bg-slate-50 border-b">
            <tr>
              <th className={TH_CLASS}>Member</th>
              <th className={TH_CLASS}>Age</th>
              <th className={TH_CLASS}>Gender</th>
              <th className={TH_CLASS}>Plan</th>
              <th className={TH_CLASS}>Joined</th>
              <th className={TH_CLASS}>Status</th>
              <th className={TH_CLASS}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <TableLoader/>
            ): members.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-10 text-center text-slate-400"
                >
                  No members found.
                </td>
              </tr>
            ) : (
              members.map((m) => (
                <tr
                  key={m.id}
                  className="hover:bg-slate-50"
                >

                  {/* MEMBER */}
                  <td className={TD_CLASS}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-700 text-xs font-semibold">
                          {getInitials(m.fullname)}
                        </span>
                      </div>

                      <span className="font-medium">
                        {m.fullname}
                      </span>
                    </div>
                  </td>


                  {/* AGE */}
                  <td className={TD_CLASS}>
                    {m.age}
                  </td>


                  {/* GENDER */}
                  <td className={TD_CLASS}>
                    {m.gender}
                  </td>


                  {/* PLAN */}
                  <td className={TD_CLASS}>
                    <span
                      className={`
                        px-2.5 py-1 rounded-lg text-xs font-medium
                        ${planColors[m.membership_plans.plan_name]}
                      `}
                    >
                      {m.membership_plans.plan_name}
                    </span>
                  </td>

                  {/* JOINED */}
                  <td className={TD_CLASS}>
                    {new Date(m.join_date!).toLocaleDateString(
                      "en-PH",
                      {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </td>

                  {/* STATUS */}
                  <td className={TD_CLASS}>
                    <select
                      value={m.status}
                      onChange={(e) =>
                        handleStatusChange(
                          m.id!,
                          e.target.value
                        )
                      }
                      className={`
                        px-2.5 py-1 rounded-lg text-xs font-medium border
                        outline-none cursor-pointer
                        ${statusColors[m.status!]}
                      `}
                    >
                      <option value="Active">
                        Active
                      </option>

                      <option value="Inactive">
                        Inactive
                      </option>

                      <option value="Suspended">
                        Suspended
                      </option>
                    </select>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-2 py-3">
                    <div className="flex items-center gap-2">

                      {/* RESEND ACTIVATION */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          setResendMember(m)
                        }
                      >
                        <Mail
                          className="h-4 w-4 text-emerald-600"
                        />
                      </Button>


                      {/* EDIT */}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() =>
                          handleEdit(m)
                        }
                      >
                        <Edit
                          className="h-4 w-4"
                        />
                      </Button>

                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>

        </table>
      </div>

      {/* RESEND MODAL */}
      <ResendActivationModal
        open={!!resendMember}
        member={resendMember!}
        onClose={() => setResendMember(null)}
      />

      {/* MEMBER MODAL (ADD + EDIT) */}
      <MemberModal
        open={openMemberModal}
        setOpen={setOpenMemberModal}
        member={selectedMember}
      />
    </>
  );
}