import { useState } from "react";
import { Mail, RefreshCcw, Repeat2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  Basic: "bg-slate-100 text-slate-700 hover:bg-slate-100",
  Premium: "bg-indigo-100 text-indigo-700 hover:bg-indigo-100",
  Elite: "bg-amber-100 text-amber-700 hover:bg-amber-100",
};

const statusColors: Record<string, string> = {
  Active: "border-emerald-200 bg-emerald-100 text-emerald-700",
  Inactive: "border-slate-200 bg-slate-100 text-slate-600",
  Suspended: "border-red-200 bg-red-100 text-red-600",
};

interface Props {
  params: MemberFilters;
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

  const TH_CLASS =
    "px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500";

  const currencyFormatter = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  });

  return (
    <>
      <Card className="overflow-hidden rounded-2xl p-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/70 hover:bg-transparent dark:bg-stone-900/50">
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
                    className="transition hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <TableCell className="p-5">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-[#963348] text-xs font-semibold text-white dark:bg-[#7A1F31]">
                            {getInitials(member.fullname)}
                          </AvatarFallback>
                        </Avatar>

                        <span className="font-medium text-slate-700 dark:text-slate-100">
                          {member.fullname}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="p-5 text-left text-slate-600 dark:text-slate-300">
                      {member.age}
                    </TableCell>

                    <TableCell className="p-5 text-left text-slate-600 dark:text-slate-300">
                      {member.gender}
                    </TableCell>

                    <TableCell className="p-5 text-left">
                      <Badge
                        className={`px-3 py-1 ${
                          planColors[member.plan_name] ??
                          "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {member.plan_name} ({member.duration}{" "}
                        {member.duration_type}) -{" "}
                        {currencyFormatter.format(Number(member.plan_price))}
                      </Badge>
                    </TableCell>

                    <TableCell className="p-5 text-left text-slate-500 dark:text-slate-400">
                      {new Date(
                        member.membership_start!,
                      ).toLocaleDateString("en-PH", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })}
                    </TableCell>

                    <TableCell className="p-5 text-left text-slate-500 dark:text-slate-400">
                      {new Date(member.membership_end!).toLocaleDateString(
                        "en-PH",
                        {
                          month: "short",
                          day: "2-digit",
                          year: "numeric",
                        },
                      )}
                    </TableCell>

                    <TableCell className="p-5 text-left">
                      <span
                        className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium ${
                          statusColors[member.status!] ??
                          "border-slate-200 bg-slate-100 text-slate-600"
                        }`}
                      >
                        {member.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      <div className="flex justify-start gap-1">
                        {member.status !== "Active" && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-[#963348]/10 dark:hover:bg-[#963348]/20"
                            onClick={() => {
                              setRenewMember(member);
                              setRenewOpen(true);
                            }}
                          >
                            <RefreshCcw
                              size={16}
                              className="text-[#963348] dark:text-[#C45A6F]"
                            />
                          </Button>
                        )}

                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-[#963348]/10 dark:hover:bg-[#963348]/20"
                          onClick={() => setResendMember(member)}
                        >
                          <Mail
                            size={16}
                            className="text-[#963348] dark:text-[#C45A6F]"
                          />
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="hover:bg-slate-100 dark:hover:bg-slate-800"
                          onClick={() => handleEdit(member)}
                        >
                          <Repeat2
                            size={16}
                            className="text-slate-700 dark:text-slate-300"
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

      <ResendActivationModal
        open={!!resendMember}
        member={resendMember!}
        onClose={() => setResendMember(null)}
      />

      <UpgradeMembershipModal
        open={openMemberModal}
        setOpen={setOpenMemberModal}
        member={selectedMember}
      />

      <RenewMembershipDialog
        open={renewOpen}
        setOpen={setRenewOpen}
        member={renewMember}
      />
    </>
  );
}