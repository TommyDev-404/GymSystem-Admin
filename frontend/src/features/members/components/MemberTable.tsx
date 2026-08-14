import { useState } from "react";
import {
  Mail,
  RefreshCcw,
  Repeat2
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
import type { Member, MemberFilters } from "@/features/members/types/member";
import { ResendActivationModal } from "./ResendActivationModal";
import { getInitials } from "@/utils/initials";
import { TableLoader } from "@/components/shared/TableLoader";
import RenewMembershipDialog from "./RenewMembershipDialog";
import { UpgradeMembershipModal } from "./UpgradeMembershipModal";
import { useMembers } from "../hooks/useMember";


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
  params: MemberFilters
}

export function MemberTable({ params }: Props) {
  const { data: members = [], isLoading } = useMembers(params);
  
  const [resendMember, setResendMember] = useState<Member | null>(null);
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [renewMember, setRenewMember] = useState<Member | null>(null);
  const [renewOpen, setRenewOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setOpenMemberModal(true);
  };
  
  const TH_CLASS = "text-left text-xs uppercase tracking-wide text-slate-400 dark:text-slate-500 font-semibold px-5 py-4";

  return (
    <>
      <Card className="rounded-2xl shadow-sm overflow-hidden p-0">
        <CardContent className="p-0">
          <Table>
            {/* HEADER */}
            <TableHeader>
              <TableRow className="hover:bg-transparent bg-slate-50/70 dark:bg-stone-900/50">
                <TableHead className={TH_CLASS}>Member</TableHead>
                <TableHead className={TH_CLASS}>Age</TableHead>
                <TableHead className={TH_CLASS}>Gender</TableHead>
                <TableHead className={TH_CLASS}>Plan</TableHead>
                <TableHead className={TH_CLASS}>Membership Start</TableHead>
                <TableHead className={TH_CLASS}>Membership Ends</TableHead>
                <TableHead className={TH_CLASS}>Status</TableHead>
                <TableHead className={TH_CLASS}>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                <TableLoader />
              ) : members.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-32 text-center text-slate-400 dark:text-slate-500"
                  >
                    No members found.
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member: Member) => (
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
                            member.plan_name
                          ]}
                        `}
                      >
                        {`${member.plan_name} (${member.duration} ${member.duration_type}) - ${new Intl.NumberFormat(
												"en-PH",
												{
													style: "currency",
													currency: "PHP",
												}
											).format(Number(member.plan_price))}`}
                      </Badge>
                    </TableCell>

                    {/* MEMBERSHIP START */}
                    <TableCell className="text-left p-5 text-slate-500 dark:text-slate-400">
                      {new Date(member.membership_start!).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>

                    {/* MEMBERSHIP END */}
                    <TableCell className="text-left p-5 text-slate-500 dark:text-slate-400">
                      {new Date(member.membership_end!).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>

                    {/* STATUS */}
                    <TableCell className="text-left p-5">
                      <span
                        className={`
                          inline-flex
                          items-center
                          rounded-md
                          px-2.5
                          py-1
                          text-xs
                          font-medium
                          ${statusColors[member.status!]}
                        `}
                      >
                        {member.status}
                      </span>
                    </TableCell>

                    {/* ACTIONS */}
                    <TableCell>
                      <div className="flex justify-left gap-1">

                        {/* RENEW */}
                        {member.status !== "Active" && 
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
                        }
                        
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

                        {/* Update MEMBERSHIP PLAN */}
                        <Button
                          size="icon"
                          variant="ghost"
                          className="
                            hover:bg-slate-100
                            dark:hover:bg-slate-800
                          "
                          onClick={() => handleEdit(member)}
                        >
                          <Repeat2
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
      <UpgradeMembershipModal
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