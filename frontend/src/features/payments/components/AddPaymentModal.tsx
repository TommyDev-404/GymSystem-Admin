import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useForm } from "react-hook-form";
import { useCreatePayment } from "../hooks/usePayments";
import type { CreatePaymentDTO } from "../types/payment";
import { toast } from "sonner";

type AddPaymentModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  unpaidMembers: {
    id: number;
    name: string;
  }[];
};

export function AddPaymentModal({ open, setOpen, unpaidMembers }: AddPaymentModalProps) {
  const { mutate: createPayment, isPending } = useCreatePayment();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<CreatePaymentDTO>({
    defaultValues: {
      member_id: 9,
      amount_paid: 0,
      paid_on: "",
    },
  });

  const onSubmit = (data: CreatePaymentDTO) => {
    createPayment(
      {
        member_id: data.member_id,
        amount_paid: data.amount_paid,
        paid_on: data.paid_on,
      },
      {
        onSuccess: () => {
          toast.success('Payment added successfully.');
          reset();
          setOpen(false);
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          {/* Member */}
          <div>
            <label className="text-sm font-medium">
              Member
            </label>

            {unpaidMembers?.length > 0 ? (
                <select
                  {...register("member_id", { required: true })}
                  className="w-full border rounded-md p-2 mt-1 bg-white"
                >
                  <option disabled hidden value="">
                    Select Member
                  </option>

                  {unpaidMembers.map((m: { id: number; name: string }) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
            ) : (
              <div className="w-full border rounded-md p-2 mt-1 bg-slate-100 text-slate-500 text-sm">
                🎉 All members are fully paid
              </div>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-medium">
              Amount(₱)
            </label>

            <input
              type="number"
              {...register("amount_paid", {
                required: true,
                valueAsNumber: true,
              })}
              className="w-full border rounded-md p-2 mt-1"
              placeholder="Enter amount"
            />
          </div>

          {/* Paid Date */}
          <div>
            <label className="text-sm font-medium">
              Paid On
            </label>

            <input
              type="date"
              {...register("paid_on", {
                required: true,
              })}
              className="w-full border rounded-md p-2 mt-1"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}