import { useState } from "react";
import {
  Edit,
  Mail,
  RefreshCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import RenewMembershipDialog from "./RenewMembershipDialog";


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
  const [renewMember, setRenewMember] = useState(null);
  const [renewOpen, setRenewOpen] = useState(false);
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

  const TH_CLASS = "text-left text-slate-700 dark:text-slate-300 px-5 py-3.5";

  return (
    <>
      <Card className="rounded-2xl shadow-sm overflow-hidden p-0">
        <CardContent className="p-0">
          <Table>

            {/* HEADER */}
            <TableHeader>
              <TableRow>
                <TableHead className={TH_CLASS}>
                  Member
                </TableHead>

                <TableHead className={TH_CLASS}>
                  Age
                </TableHead>

                <TableHead className={TH_CLASS}>
                  Gender
                </TableHead>

                <TableHead className={TH_CLASS}>
                  Plan
                </TableHead>

                <TableHead className={TH_CLASS}>
                  Membership Ends
                </TableHead>

                <TableHead className={TH_CLASS}>
                  Status
                </TableHead>

                <TableHead className={TH_CLASS}>
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
                    className="h-32 text-center text-slate-400 dark:text-slate-500"
                  >
                    No members found.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow
                    key={member.id}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                  >
                    {/* MEMBER */}
                    <TableCell className="p-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback
                            className="
                              bg-emerald-100
                              text-emerald-700
                              dark:bg-emerald-900/40
                              dark:text-emerald-300
                              text-xs
                              font-semibold
                            "
                          >
                            {getInitials(member.fullname)}
                          </AvatarFallback>
                        </Avatar>

                        <span className="font-medium text-slate-700 dark:text-slate-100">
                          {member.fullname}
                        </span>
                      </div>
                    </TableCell>

                    {/* AGE */}
                    <TableCell className="text-left p-5 text-slate-600 dark:text-slate-300">
                      {member.age}
                    </TableCell>

                    {/* GENDER */}
                    <TableCell className="text-left p-5 text-slate-600 dark:text-slate-300">
                      {member.gender}
                    </TableCell>

                    {/* PLAN */}
                    <TableCell className="text-left p-5">
                      <Badge
                        className={`
                          px-3 py-1
                          ${planColors[
                            member.membership_plans.plan_name
                          ]}
                        `}
                      >
                        {`${member.membership_plans.plan_name} (${member.membership_plans.duration} ${member.membership_plans.duration_type})`}
                      </Badge>
                    </TableCell>

                    {/* JOIN DATE */}
                    <TableCell className="text-left p-5 text-slate-500 dark:text-slate-400">
                      {new Date(member.join_date!).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>

                    {/* STATUS */}
                    <TableCell className="text-left p-5">
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
                            h-8
                            w-[120px]
                            rounded-md
                            text-xs
                            border
                            dark:border-slate-700
                            dark:bg-slate-800
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
                      <div className="flex justify-left gap-1">

                        {/* RENEW */}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="
                            hover:bg-emerald-50
                            dark:hover:bg-emerald-900/30
                          "
                          onClick={() => {
                            setRenewMember(member);
                            setRenewOpen(true);
                          }}
                        >
                          <RefreshCcw
                            size={16}
                            className="
                              text-emerald-600
                              dark:text-emerald-400
                            "
                          />
                        </Button>
                        
                        {/* RESEND ACTIVATION CODE */}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="
                            hover:bg-emerald-50
                            dark:hover:bg-emerald-900/30
                          "
                          onClick={() => setResendMember(member)}
                        >
                          <Mail
                            size={16}
                            className="
                              text-blue-600
                              dark:text-blue-400
                            "
                          />
                        </Button>

                        {/* EDIT */}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="
                            hover:bg-slate-100
                            dark:hover:bg-slate-800
                          "
                          onClick={() => handleEdit(member)}
                        >
                          <Edit
                            size={16}
                            className="
                              text-slate-700
                              dark:text-slate-300
                            "
                          />
                        </Button>


                      </div>
                    </TableCell>


                  </TableRow>

                ))

              )}

            </TableBody>

          </Table>
        </CardContent>
      </Card>

      {/* RESEND */}
      <ResendActivationModal
        open={!!resendMember}
        member={resendMember!}
        onClose={() =>setResendMember(null)}
      />

      {/* ADD */}
      <MemberModal
        open={openMemberModal}
        setOpen={setOpenMemberModal}
        member={selectedMember}
      />

      {/* RENEW MEMBERSHIP*/}
      <RenewMembershipDialog
        open={renewOpen}
        setOpen={setRenewOpen}
        member={renewMember}
        onRenew={() => {
          console.log("renew membership");
        }}
      />
    </>
  );
}