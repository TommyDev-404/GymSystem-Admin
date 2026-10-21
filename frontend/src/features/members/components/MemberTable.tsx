import { useState } from "react";
import { Eye, Mail } from "lucide-react";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Member, MemberFilters } from "@/features/members/types/member";
import { ResendActivationModal } from "./ResendActivationModal";
import { getInitials } from "@/utils/initials";
import { TableLoader } from "@/components/shared/TableLoader";
import RenewMembershipDialog from "./RenewMembershipDialog";
import { UpgradeMembershipModal } from "./UpgradeMembershipModal";
import { useMembers } from "../hooks/useMember";
import { PaymentHistoryModal } from "./PaymentHistoryModal";

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

const formatMembershipDate = (date: string | Date) => {
  const value = new Date(date);

  return {
    date: value.toLocaleDateString("en-PH", {
      timeZone: "Asia/Manila",
      month: "short",
      day: "2-digit",
      year: "numeric",
    }),
    time: value.toLocaleTimeString("en-PH", {
      timeZone: "Asia/Manila",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
};

export function MemberTable({ params }: Props) {
  const { data: members = [], isLoading } = useMembers(params);

  const [resendMember, setResendMember] = useState<Member | null>(null);
  const [openMemberModal, setOpenMemberModal] = useState(false);
  const [renewMember, setRenewMember] = useState<Member | null>(null);
  const [renewOpen, setRenewOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [paymentHistoryMember, setPaymentHistoryMember] = useState<Member | null>(null);
  const [paymentHistoryOpen, setPaymentHistoryOpen] = useState(false);

  /*
  const handleEdit = (member: Member) => {
    setSelectedMember(member);
    setOpenMemberModal(true);
  };
*/
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
          <TooltipProvider>
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/70 hover:bg-transparent dark:bg-stone-900/50">
                  <TableHead className={TH_CLASS}>Member</TableHead>
                  <TableHead className={TH_CLASS}>Membership Plan</TableHead>
                  <TableHead className={TH_CLASS}>Membership Start</TableHead>
                  <TableHead className={TH_CLASS}>Membership Ends</TableHead>
                  <TableHead className={`${TH_CLASS} text-center`}>
                    Membership Status
                  </TableHead>
                  <TableHead className={`${TH_CLASS} text-center`}>
                    Engagement Status
                  </TableHead>
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
                          <Avatar className="h-10 w-10 shrink-0">
                            <AvatarFallback className="bg-[#963348] text-xs font-semibold text-white dark:bg-[#7A1F31]">
                              {getInitials(member.fullname)}
                            </AvatarFallback>
                          </Avatar>
                      
                          <div className="flex min-w-0 flex-col gap-1">
                            <span className="truncate font-medium text-slate-800 dark:text-slate-100">
                              {member.fullname}
                            </span>
                            
                            <span className="truncate text-xs text-slate-500 dark:text-slate-400">
                              {member.email}
                            </span>
                            
                            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                              <span>{member.age} years old</span>
                              <span className="text-slate-300 dark:text-slate-600">•</span>
                              <span>{member.gender}</span>
                            </div>
                      
                          </div>
                        </div>
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
                      
                      <TableCell className="p-5">
                        {member.membership_start ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {formatMembershipDate(member.membership_start).date}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {formatMembershipDate(member.membership_start).time}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </TableCell>

                      <TableCell className="p-5">
                        {member.membership_end ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                              {formatMembershipDate(member.membership_end).date}
                            </span>
                            <span className="text-xs text-slate-400 dark:text-slate-500">
                              {formatMembershipDate(member.membership_end).time}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </TableCell>

                      <TableCell className="p-5 text-center">
                        <span
                          className={`inline-flex items-center justify-center rounded-md px-2.5 py-1 text-xs font-medium ${
                            statusColors[member.status!] ??
                            "border-slate-200 bg-slate-100 text-slate-600"
                          }`}
                        >
                          {member.status}
                        </span>
                      </TableCell>

                      <TableCell className="p-5 text-center">
                        <Badge
                          variant="outline"
                          className={`mx-auto inline-flex justify-center ${
                            member.engagement_status === "ACTIVE"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : member.engagement_status === "AT_RISK"
                                ? "border-amber-200 bg-amber-50 text-amber-700"
                                : member.engagement_status === "INACTIVE"
                                  ? "border-slate-200 bg-slate-100 text-slate-600"
                                  : "border-blue-200 bg-blue-50 text-blue-700"
                          }`}
                        >
                          {member.engagement_status === "AT_RISK"
                            ? "At Risk"
                            : member.engagement_status === "NO_ATTENDANCE"
                              ? "No Attendance Yet"
                              : member.engagement_status === "ACTIVE"
                                ? "Active"
                                : "Inactive"}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex justify-start gap-1">
                          {/*
                            {member.status === "Expired" ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
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
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Renew membership</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
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
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Upgrade membership</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          */}
                          <Tooltip>
                            <TooltipTrigger asChild>
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
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Resend email</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="hover:bg-[#963348]/10 dark:hover:bg-[#963348]/20"
                                onClick={() => {
                                  setPaymentHistoryMember(member);
                                  setPaymentHistoryOpen(true);
                                }}
                              >
                                <Eye size={16} className="text-purple-700" />
                              </Button>
                            </TooltipTrigger>

                            <TooltipContent>
                              <p>View Payment History</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TooltipProvider>
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
     
      {paymentHistoryOpen && paymentHistoryMember !== null && (
        <PaymentHistoryModal
          open={paymentHistoryOpen}
          onOpenChange={(open) => {
            setPaymentHistoryOpen(open);

            if (!open) {
              setPaymentHistoryMember(null);
            }
          }}
          memberId={paymentHistoryMember.id}
        />
      )}
      
    </>
  );
}