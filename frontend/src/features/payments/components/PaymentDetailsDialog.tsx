import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Payment } from "../types/PaymentTypes";
import { toPHP } from "@/utils/currencyConverter";


interface Props {
   open: boolean;
   onClose: (value:boolean)=>void;
   payment?: Payment;
}
 
 
export default function PaymentDetailsDialog({ open, onClose, payment }: Props) {
   
   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent
            className="
               sm:max-w-md
               rounded-2xl
               bg-white
               dark:bg-stone-900
               border-stone-200
               dark:border-stone-700
            "
         >
            <DialogHeader>
               <DialogTitle
                  className="
                     text-xl
                     font-semibold
                     text-slate-800
                     dark:text-slate-100
                  "
               >
                  Payment Details
               </DialogTitle>
            </DialogHeader>

            <div className="space-y-5 mt-3">
               {/* MEMBER */}
               <div className="space-y-2">

               <p
               className="
               text-xs
               uppercase
               font-semibold
               tracking-wide
               text-slate-400
               "
               >
               Member Information
               </p>


               <div
               className="
               p-4
               rounded-xl
               bg-slate-50
               dark:bg-stone-800
               "
               >

               <p
               className="
               font-medium
               text-slate-800
               dark:text-slate-100
               "
               >
               {payment?.memberName}
               </p>


               <p
               className="
               text-sm
               text-slate-500
               "
               >
               {payment?.plan}
               </p>


               </div>

               </div>

               {/* PAYMENT */}
               <div className="space-y-3">
                  <p
                     className="
                     text-xs
                     uppercase
                     font-semibold
                     tracking-wide
                     text-slate-400
                     "
                  >
                     Payment Information
                  </p>

                  <div className="space-y-2">
                     <div className="flex justify-between">

                     <span className="text-slate-500">
                     Amount
                     </span>


                     <span className="font-semibold">
                     {toPHP(payment?.amount.toString() ?? "0")}
                     </span>

                     </div>

                     <div className="flex justify-between">

                     <span className="text-slate-500">
                     Status
                     </span>


                     <Badge
                     className="
                     bg-emerald-100
                     text-emerald-700
                     dark:bg-emerald-900/40
                     dark:text-emerald-300
                     "
                     >
                     {payment?.status}
                     </Badge>


                     </div>

                     <div className="flex justify-between">

                     <span className="text-slate-500">
                     Method
                     </span>


                     <span>
                     {payment?.paymentMethod ?? "-"}
                     </span>


                     </div>

                     <div className="flex justify-between">

                     <span className="text-slate-500">
                     Paid On
                     </span>


                     <span>
                     {
                     payment?.paidDate
                     ?
                     new Date(payment.paidDate)
                     .toLocaleDateString(
                     "en-PH",
                     {
                     month:"short",
                     day:"2-digit",
                     year:"numeric"
                     }
                     )
                     :
                     "-"
                     }
                     </span>


                     </div>
                  </div>
               </div>

               <Button
               className="
               w-full
               h-11
               bg-emerald-500
               hover:bg-emerald-600
               text-white
               "
               onClick={()=>onClose(false)}
               >
               Close
               </Button>
            </div>
         </DialogContent>
      </Dialog>
   );
}