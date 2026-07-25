import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useForm, Controller } from "react-hook-form";
import { useCreatePayment } from "../hooks/usePayments";
import type { CreatePaymentDTO, UnpaidMember } from "../types/payment";
import { toast } from "sonner";

type AddPaymentModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  unpaidMembers: UnpaidMember[];
};

export function AddPaymentModal({ open, setOpen, unpaidMembers }: AddPaymentModalProps) {
  const { mutate: createPayment, isPending } = useCreatePayment();

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
  } = useForm<CreatePaymentDTO>({
    defaultValues: {
      member_id: undefined,
      amount_paid: undefined,
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
            Add Payment
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="
            flex
            flex-col
            gap-5
            mt-3
          "
        >
          {/* Member */}
          <div className="space-y-1.5">
            <label
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Member
            </label>

            {unpaidMembers?.length > 0 ? (
              <Controller
                control={control}
                name="member_id"
                rules={{ required: true }}
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(val) => {
                      const id = Number(val);
                      field.onChange(id);

                      const selected = unpaidMembers.find((m) => m.id === id);
                      if (selected) {
                        setValue("amount_paid", selected.amount, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                      }
                    }}
                  >
                    <SelectTrigger
                      className="
                        bg-white
                        dark:bg-stone-800
                        border-slate-200
                        dark:border-stone-700
                        text-slate-700
                        dark:text-slate-200
                        w-full
                        py-5.5
                      "
                    >
                      <SelectValue placeholder="Select member" />
                    </SelectTrigger>

                    <SelectContent
                      className="
                        bg-white
                        dark:bg-stone-900
                        border-slate-200
                        dark:border-stone-700
                      "
                    >
                      {unpaidMembers.map((m) => (
                        <SelectItem key={m.id} value={String(m.id)}>
                          {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            ) : (
              <div
                className="
                  w-full
                  h-11
                  flex
                  items-center
                  rounded-md
                  border
                  border-slate-200
                  dark:border-stone-700
                  px-3
                  bg-slate-100
                  dark:bg-stone-800
                  text-slate-500
                  dark:text-slate-400
                  text-sm
                "
              >
                All members are fully paid
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <label
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Amount (₱)
            </label>

            <Input
              type="number"
              readOnly
              placeholder="Amount to pay (read only)"
              {...register("amount_paid", {
                required: true,
                valueAsNumber: true,
              })}
              className="
                h-11
                bg-white
                dark:bg-stone-800
                border-slate-200
                dark:border-stone-700
                text-slate-700
                dark:text-slate-200
              "
            />
          </div>

          {/* Paid Date */}
          <div className="space-y-1.5">
            <label
              className="
                text-sm
                font-medium
                text-slate-700
                dark:text-slate-200
              "
            >
              Paid On
            </label>

            <Input
              type="date"
              {...register("paid_on", {
                required: true,
              })}
              className="
                h-11
                bg-white
                dark:bg-stone-800
                border-slate-200
                dark:border-stone-700
                text-slate-700
                dark:text-slate-200
              "
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="
                flex-1
                h-11
                border-slate-200
                dark:border-stone-700
                dark:text-slate-200
                dark:hover:bg-stone-800
              "
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className="
                flex-1
                h-11
                bg-emerald-500
                hover:bg-emerald-600
                text-white
              "
            >
              {isPending ? "Saving..." : "Save Payment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}