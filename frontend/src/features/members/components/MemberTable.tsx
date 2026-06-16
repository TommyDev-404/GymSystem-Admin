import { Button } from "@/components/ui/button";
import type { Member } from "@/features/members/types/member";
import { Edit, Trash2 } from "lucide-react";

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

function getExpirationColor(expiration: string) {
  const today = new Date();
  const exp = new Date(expiration);

  const diffDays = Math.ceil(
    (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays < 0) return "text-red-600";      // expired
  if (diffDays <= 3) return "text-amber-600";   // expiring soon
  return "text-emerald-600";                    // active
}

export function MemberTable({
  members,
  onEdit,
  onDelete,
}: {
  members: Member[];
  onEdit: (m: Member) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden">
      <table className="w-full text-sm">

        {/* HEADER */}
        <thead className="bg-slate-50 border-b">
          <tr>
            <th className={TH_CLASS}>Member</th>
            <th className={TH_CLASS}>Age</th>
            <th className={TH_CLASS}>Gender</th>
            <th className={TH_CLASS}>Plan</th>
            <th className={TH_CLASS}>Expiration</th>
            <th className={TH_CLASS}>Status</th>
            <th className={TH_CLASS}>Joined</th>
            <th className={TH_CLASS}>Actions</th>
          </tr>
        </thead>

        {/* BODY */}
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-10 text-center text-slate-400">
                No members found.
              </td>
            </tr>
          ) : (
            members.map((m) => (
              <tr key={m.id} className="hover:bg-slate-50 transition-colors">

                {/* Member */}
                <td className={TD_CLASS}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-700 text-xs font-semibold">
                        {m.avatar}
                      </span>
                    </div>
                    <span className="text-slate-700 font-medium">{m.name}</span>
                  </div>
                </td>

                <td className={TD_CLASS}>{m.age}</td>
                <td className={TD_CLASS}>{m.gender}</td>

                {/* PLAN */}
                <td className={TD_CLASS}>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${planColors[m.plan]}`}>
                    {m.plan}
                  </span>
                </td>

                {/* EXPIRATION (FIXED) */}
                <td className={TD_CLASS}>
                  <span className={`font-medium ${getExpirationColor(m.expiration)}`}>
                    {new Date().toLocaleDateString('en-PH', {month: 'short', day: '2-digit', year: 'numeric'})}
                  </span>
                </td>

                {/* STATUS */}
                <td className={TD_CLASS}>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-medium border ${statusColors[m.status]}`}>
                    {m.status}
                  </span>
                </td>

                {/* JOINED */}
                <td className={TD_CLASS}>{m.joined}</td>

                {/* ACTIONS */}
                <td className="px-2 py-3 text-left">
                  <div className="flex items-center justify-start gap-2">
                    <Button size="icon" variant="ghost" onClick={() => onEdit(m)}>
                      <Edit className="h-4 w-4" />
                    </Button>

                    <Button size="icon" variant="ghost" onClick={() => onDelete(m.id)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}