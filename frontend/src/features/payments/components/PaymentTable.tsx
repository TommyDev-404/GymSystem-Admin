import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Eye,
  CreditCard,
} from "lucide-react";

import type { Payment } from "@/features/payments/types/PaymentTypes";
import { statusConfig } from "@/utils/statusConfig";
import { getInitials } from "@/utils/initials";
import { TableLoader } from "@/components/shared/TableLoader";
import PayPaymentDialog from "./PayPaymentDialog";
import { useState } from "react";
import PaymentDetailsDialog from "./PaymentDetailsDialog";


interface Props {
  payments: Payment[];
  isLoading: boolean;
}

const TH_CLASS = "text-left text-slate-500 dark:text-slate-400 font-medium px-5 py-3.5 h-auto";
const TD_CLASS = "px-5 py-5";

export function PaymentsTable({payments, isLoading}: Props) {

  const [showDialog, setShowDialog] = useState<"pay" | "view" | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment |null>(null);

  const onPay = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDialog('pay');
  };

  const onView = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowDialog('view');
  };

  return (
    <>
      <Card className="rounded-2xl shadow-sm overflow-hidden p-0">
        <CardContent className="p-0">
          <Table className="text-sm">
            {/* HEADER */}
            <TableHeader>

              <TableRow>

                <TableHead className={TH_CLASS}>
                  Member
                </TableHead>


                <TableHead className={TH_CLASS}>
                  Plan
                </TableHead>


                <TableHead className={TH_CLASS}>
                  Amount
                </TableHead>


                <TableHead className={TH_CLASS}>
                  Status
                </TableHead>


                <TableHead className={TH_CLASS}>
                  Method
                </TableHead>


                <TableHead className={TH_CLASS}>
                  Paid On
                </TableHead>


                <TableHead className={TH_CLASS}>
                  Actions
                </TableHead>


              </TableRow>


            </TableHeader>

            {/* BODY */}
            <TableBody>
              {isLoading ? (
                <TableLoader />
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="
                      text-center
                      py-10
                      text-slate-400
                      dark:text-slate-500
                    "
                  >
                    No payments found.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((p)=>{
                  const cfg = statusConfig[p.status];

                  return (
                    <TableRow
                      key={p.id}
                      className="
                        hover:bg-slate-50
                        dark:hover:bg-slate-800
                        transition-colors
                      "
                    >
                      {/* MEMBER */}
                      <TableCell className={TD_CLASS}>

                        <div className="flex items-center gap-3">

                          <Avatar className="w-9 h-9 shrink-0">

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
                              {getInitials(p.memberName)}
                            </AvatarFallback>

                          </Avatar>


                          <span
                            className="
                              text-slate-700
                              dark:text-slate-100
                              font-medium
                            "
                          >
                            {p.memberName}
                          </span>


                        </div>


                      </TableCell>

                      {/* PLAN */}
                      <TableCell className={TD_CLASS}>

                        <Badge
                          className="
                            bg-indigo-100
                            text-indigo-700
                            dark:bg-indigo-900/40
                            dark:text-indigo-300
                          "
                        >
                          {p.plan}
                        </Badge>

                      </TableCell>

                      {/* AMOUNT */}
                      <TableCell
                        className="
                          px-5
                          py-5
                          font-medium
                          text-slate-700
                          dark:text-slate-100
                        "
                      >

                        {new Intl.NumberFormat(
                          "en-PH",
                          {
                            style:"currency",
                            currency:"PHP",
                          }
                        ).format(p.amount)}

                      </TableCell>

                      {/* STATUS */}
                      <TableCell className={TD_CLASS}>

                        <Badge
                          className={`
                            gap-1.5
                            border
                            font-medium
                            hover:bg-inherit
                            ${cfg.color}
                          `}
                        >

                          <cfg.icon className="h-3 w-3"/>

                          {p.status}

                        </Badge>

                      </TableCell>

                      {/* METHOD */}
                      <TableCell
                        className="
                          px-5
                          py-5
                          text-slate-500
                          dark:text-slate-400
                        "
                      >

                        {p.paymentMethod ?? "-"}

                      </TableCell>

                      {/* PAID ON */}
                      <TableCell
                        className="
                          px-5
                          py-5
                          text-slate-500
                          dark:text-slate-400
                        "
                      >

                        {p.paidDate ? (

                          new Date(
                            p.paidDate
                          ).toLocaleDateString(
                            "en-PH",
                            {
                              year:"numeric",
                              month:"short",
                              day:"2-digit",
                            }
                          )

                        ) : (

                          <Badge
                            className="
                              bg-slate-100
                              text-slate-400
                              dark:bg-slate-800
                              dark:text-slate-500
                            "
                          >
                            Not paid
                          </Badge>

                        )}

                      </TableCell>

                      {/* ACTIONS */}
                      <TableCell className={TD_CLASS}>
                        {p.status === "Pending" ? (
                          <Button
                            size="sm"
                            className="
                              bg-emerald-500
                              hover:bg-emerald-600
                              text-white
                              gap-2
                            "
                            onClick={() => onPay(p)}
                          >
                            <CreditCard size={15}/>
                            Pay
                          </Button>
                        ) : (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="
                              hover:bg-slate-100
                              dark:hover:bg-slate-800
                            "
                            onClick={() => onView(p)}
                          >
                            <Eye
                              size={16}
                              className="
                                text-slate-600
                                dark:text-slate-300
                              "
                            />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <PayPaymentDialog
        payment={selectedPayment!}
        open={showDialog === 'pay' && true}
        onClose={() => setShowDialog(null)}
      />

      <PaymentDetailsDialog
        payment={selectedPayment!}
        open={showDialog === 'view' && true}
        onClose={() => setShowDialog(null)}
      />
    </>
  );
}