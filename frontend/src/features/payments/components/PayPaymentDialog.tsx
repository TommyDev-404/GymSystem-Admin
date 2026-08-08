import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { toPHP } from "@/utils/currencyConverter";
import type { Payment } from "../types/PaymentTypes";
import { useCreatePayment } from "../hooks/usePayments";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
 
 
interface Props {
   open:boolean;
   onClose:(value:boolean)=>void;
   payment: Payment;
}

type PaymentForm = {
   payment_method: "Cash" | "GCash" | "Bank_Transfer";
};

export default function PayPaymentDialog({open, onClose, payment}: Props) {
   const { mutate: createPayment, isPending } = useCreatePayment();

   const {
      control,
      handleSubmit,
      reset
   } = useForm<PaymentForm>({
      defaultValues: {
         payment_method: undefined,
      }
   });
   
   const onSubmit = (data: PaymentForm) => {
      createPayment(
         {
            payment_id: payment.id,
            payment_method: data.payment_method,
            paid_at: new Date(),
         },
         {
            onSuccess: (data) => {
               toast.success(data.message);
               reset();
               onClose(false);
            }
         }
      );
   };
   
   return (
      <Dialog open={open} onOpenChange={onClose}>
         <DialogContent
            className="
               sm:max-w-md
               rounded-2xl
               bg-white
               dark:bg-stone-900
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
            Confirm Payment
            </DialogTitle>
            
            </DialogHeader>
            
            <div className="space-y-5 mt-3">
               <div
                  className="
                     p-4
                     rounded-xl
                     bg-slate-50
                     dark:bg-stone-800
                  "
               >
                  <p className="font-medium">{payment?.memberName}</p>
                  <p className="text-sm text-slate-500">{payment?.plan}</p>
                  <p className="mt-2 font-semibold">{toPHP(payment?.amount.toString())}</p>      
               </div>
               
               <div className="space-y-2">
                  <label className="text-sm font-medium">Payment Method</label>

                  <div className="w-full">
                     <Controller
                        control={control}
                        name="payment_method"
                        rules={{
                           required: "Payment method is required"
                        }}
                        render={({ field }) => (

                           <Select
                              value={field.value}
                              onValueChange={field.onChange}
                           >

                              <SelectTrigger
                              className="
                                 w-full
                                 bg-white
                                 dark:bg-stone-800
                                 border-slate-200
                                 dark:border-stone-700
                                 text-slate-700
                                 dark:text-slate-200
                                 py-6
                              "
                              >
                              <SelectValue placeholder="Select method" />
                              </SelectTrigger>


                              <SelectContent>

                              <SelectItem value="Cash">
                                 Cash
                              </SelectItem>


                              <SelectItem value="GCash">
                                 GCash
                              </SelectItem>
                              
                              <SelectItem value="Bank_Transfer">
                                 Bank Transfer
                              </SelectItem>


                              </SelectContent>

                           </Select>

                        )}
                     />
                  </div>
               </div>

               <div className="flex gap-3">
                  <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => onClose(false)}
                  >
                  Cancel
                  </Button>
                  
                  <Button
                  className="
                     flex-1
                     bg-emerald-500
                     hover:bg-emerald-600
                     text-white
                  "
                  disabled={isPending}
                  onClick={handleSubmit(onSubmit)}
                  >
                  {isPending
                     ? "Processing..."
                     : "Confirm Payment"
                  }
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}