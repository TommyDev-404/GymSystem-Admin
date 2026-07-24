import { useState } from "react";
import {
  Edit,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Member } from "@/features/members/types/member";
import { ResendActivationModal } from "./ResendActivationModal";
import { MemberModal } from "./MemberModal";
import { getInitials } from "@/utils/initials";
import { useUpdateMemberStatus } from "../hooks/useMember";
import { toast } from "sonner";
import { TableLoader } from "@/components/shared/TableLoader";


const planColors: Record<string, string> = {
  Basic:"bg-slate-100 text-slate-700 hover:bg-slate-100",
  Premium:"bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
  Elite:"bg-amber-100 text-amber-700 hover:bg-amber-100",
};

const statusColors: Record<string, string> = {
  Active:"bg-emerald-100 text-emerald-700 border-emerald-200",
  Inactive:"bg-slate-100 text-slate-600 border-slate-200",
  Suspended:"bg-red-100 text-red-600 border-red-200",
};

interface Props {
  members: Member[];
  isLoading: boolean;
}

export function MemberTable({members, isLoading}: Props) {
  const { mutate: updateStatus } = useUpdateMemberStatus();

  const [resendMember, setResendMember] = useState<Member | null>(null);
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setOpenMemberModal(true);
  };

  const handleStatusChange = (id: number, status: string) => {
    updateStatus(
      {
        id,
        data: {
          status
        }
      },
      {
        onSuccess: () => {
          toast.success(
            "Status updated successfully."
          );
        },
      }
    );
  };

  return (
    <>
      <Card className="rounded-xl border shadow-sm overflow-hidden">
  <Table>

    <TableHeader>
      <TableRow>

        <TableHead className="text-center">
          Member
        </TableHead>

        <TableHead className="text-center">
          Age
        </TableHead>

        <TableHead className="text-center">
          Gender
        </TableHead>

        <TableHead className="text-center">
          Plan
        </TableHead>

        <TableHead className="text-center">
          Joined
        </TableHead>

        <TableHead className="text-center">
          Status
        </TableHead>

        <TableHead className="text-center">
          Actions
        </TableHead>

      </TableRow>
    </TableHeader>


    <TableBody>

      {isLoading ? (

        <TableLoader />

      ) : members.length === 0 ? (

        <TableRow>
          <TableCell
            colSpan={7}
            className="h-32 text-center text-slate-400"
          >
            No members found.
          </TableCell>
        </TableRow>

      ) : (

        members.map((member) => (

          <TableRow
            key={member.id}
            className="hover:bg-slate-50 transition"
          >


            {/* MEMBER */}
            <TableCell>

              <div className="flex items-center justify-center gap-3">

                <Avatar className="h-9 w-9">

                  <AvatarFallback
                    className="
                      bg-emerald-100
                      text-emerald-700
                      text-xs
                      font-semibold
                    "
                  >
                    {getInitials(member.fullname)}
                  </AvatarFallback>

                </Avatar>


                <span className="font-medium text-slate-700">
                  {member.fullname}
                </span>

              </div>

            </TableCell>



            {/* AGE */}
            <TableCell className="text-center text-slate-600">
              {member.age}
            </TableCell>



            {/* GENDER */}
            <TableCell className="text-center text-slate-600">
              {member.gender}
            </TableCell>



            {/* PLAN */}
            <TableCell className="text-center">

              <Badge
                className={`
                  px-3 py-1
                  ${planColors[
                    member.membership_plans.plan_name
                  ]}
                `}
              >
                {member.membership_plans.plan_name}
              </Badge>

            </TableCell>



            {/* JOIN DATE */}
            <TableCell className="text-center text-slate-500">

              {new Date(
                member.join_date!
              ).toLocaleDateString(
                "en-PH",
                {
                  month:"short",
                  day:"2-digit",
                  year:"numeric",
                }
              )}

            </TableCell>

            {/* STATUS */}
            <TableCell className="text-center">

              <Select
                value={member.status}
                onValueChange={(value) =>
                  handleStatusChange(
                    member.id!,
                    value
                  )
                }
              >

                <SelectTrigger
                  className={`
                    mx-auto
                    h-8
                    w-[120px]
                    rounded-md
                    text-xs
                    ${statusColors[member.status!]}
                  `}
                >

                  <SelectValue />

                </SelectTrigger>


                <SelectContent>

                  <SelectItem value="Active">
                    Active
                  </SelectItem>

                  <SelectItem value="Inactive">
                    Inactive
                  </SelectItem>

                  <SelectItem value="Suspended">
                    Suspended
                  </SelectItem>

                </SelectContent>

              </Select>

            </TableCell>

            {/* ACTIONS */}
            <TableCell>
              <div className="flex justify-center gap-1">

                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-emerald-50"
                  onClick={() =>
                    setResendMember(member)
                  }
                >
                  <Mail
                    size={16}
                    className="text-emerald-600"
                  />
                </Button>


                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() =>
                    handleEdit(member)
                  }
                >
                  <Edit size={16}/>
                </Button>


              </div>

            </TableCell>


          </TableRow>

        ))

      )}

    </TableBody>

  </Table>
</Card>

      {/* RESEND */}
      <ResendActivationModal
        open={!!resendMember}
        member={resendMember!}
        onClose={() =>setResendMember(null)}
      />

      {/* ADD / EDIT */}
      <MemberModal
        open={openMemberModal}
        setOpen={setOpenMemberModal}
        member={selectedMember}
      />
    </>
  );
}