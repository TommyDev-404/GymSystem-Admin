import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { usePlans } from "@/features/settings/sections/membership_plans/hook/usePlan";
import type { Member, MemberPlan } from "../types/member";
import { useUpgradeMembership } from "../hooks/useMember";

interface UpgradeMembershipModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  member: Member | null;
}

interface ChangePlanForm {
  plan_id?: number;
  payment_method: "Cash" | "GCash";
}

export function UpgradeMembershipModal({
  open,
  setOpen,
  member,
}: UpgradeMembershipModalProps) {

  const { data: plans = [], isLoading: plansLoading } = usePlans();
  const { mutate: upgradeMembership, isPending } = useUpgradeMembership();


  const { control, handleSubmit, watch, reset } = useForm<ChangePlanForm>({
    defaultValues: {
      plan_id: undefined,
      payment_method: "Cash",
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        plan_id: undefined,
        payment_method: "Cash",
      });
    }
  }, [open, member?.id, reset]);

  const selectedPlanId = watch("plan_id");

  const currentPlan = useMemo(() => {
    if (!member?.plan_id) return undefined;
    return plans.find((plan: MemberPlan) => plan.id === Number(member.plan_id));
  }, [plans, member?.plan_id]);

  const selectedPlan = useMemo(() => {
    if (!selectedPlanId) return undefined;
    return plans.find((plan: MemberPlan) => plan.id === Number(selectedPlanId));
  }, [plans, selectedPlanId]);

  const currentPrice = Number(currentPlan?.price ?? 0);
  const newPrice = Number(selectedPlan?.price ?? 0);
  const additionalAmount = Math.max(newPrice - currentPrice, 0);
  const isUpgrade = !!selectedPlan && newPrice > currentPrice;

  const availablePlans = useMemo(() => {
    return plans.filter((plan: MemberPlan) => Number(plan.price) > currentPrice);
  }, [plans, currentPrice]);

  const onSubmit = (data: ChangePlanForm) => {
    if (!member) {
      toast.error("Member not found.");
      return;
    }

    if (!currentPlan) {
      toast.error("Current membership plan not found.");
      return;
    }

    if (!selectedPlan) {
      toast.error("Please select a new membership plan.");
      return;
    }

    if (newPrice <= currentPrice) {
      toast.error("Please select a higher-priced membership plan.");
      return;
    }

    upgradeMembership(
      {
        id: member.id!,
        data: {
          membership_id: member.membership_id,
          plan_id: selectedPlan.id,
          payment_method: data.payment_method,
          amount: additionalAmount,
        },
      },
      {
        onSuccess: () => {
          toast.success("Membership plan changed successfully.");
          setOpen(false);
          reset();
        },
        onError: () => {
          toast.error("Failed to change membership plan.");
        },
      }
    );
    

    console.log("Change membership:", {
      member_id: member.id,
      membership_id: member.membership_id,
      current_plan_id: currentPlan.id,
      new_plan_id: selectedPlan.id,
      current_price: currentPrice,
      new_price: newPrice,
      additional_amount: additionalAmount,
      payment_method: data.payment_method,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Upgrade Membership Plan
          </DialogTitle>
        </DialogHeader>

        {!member ? (
          <div className="py-6 text-center text-sm text-slate-500">
            No member selected.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-5 mt-3"
          >
            {/*  CURRENT PLAN */}
            <div className="rounded-xl bg-slate-50 dark:bg-stone-800 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Current Plan
              </p>

              <div className="flex items-center justify-between mt-2">
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {currentPlan?.plan_name ?? "No plan found"}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Current membership
                  </p>
                </div>

                <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  ₱
                  {currentPrice.toLocaleString("en-PH", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            {/* AVAILABLE PLANS */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Available Plans
              </label>

              <p className="text-xs text-slate-500 dark:text-slate-400"> 
               Only membership plans with a higher price than the current plan are shown. 
               </p>
              
              <Controller
                control={control}
                name="plan_id"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => {
                      field.onChange(Number(value));
                    }}
                    disabled={plansLoading || availablePlans.length === 0}
                  >
                    <SelectTrigger className="w-full py-5.5 bg-white dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-slate-200">
                      <SelectValue
                        placeholder={
                          plansLoading
                            ? "Loading plans..."
                            : availablePlans.length === 0
                              ? "No upgrade plans available"
                              : "Select new membership plan"
                        }
                      />
                    </SelectTrigger>

                    <SelectContent
                      position="popper"
                      className="z-[100] bg-white dark:bg-stone-900 border-slate-200 dark:border-stone-700"
                    >
                      {availablePlans.map((p: MemberPlan) => (
                        <SelectItem key={p.id} value={String(p.id)}>
                          {p.plan_name} ({p.duration}{" "}
                          {p.duration_type.toLowerCase()}) — ₱
                          {Number(p.price).toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* PAYMENT SUMMARY */}
            {selectedPlan && isUpgrade && (
              <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-4 space-y-3">
                {/* CURRENT PAYMENT */}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    Current payment
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    ₱
                    {currentPrice.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* NEW PLAN */}
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400">
                    New plan
                  </span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">
                    ₱
                    {newPrice.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>

                {/* ADDITIONAL AMOUNT */}
                <div className="border-t border-emerald-200 dark:border-emerald-900/50 pt-3 flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">
                    Additional Amount
                  </span>
                  <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    ₱
                    {additionalAmount.toLocaleString("en-PH", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>
            )}

            {/* PAYMENT METHOD */}
            {selectedPlan && isUpgrade && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Payment Method
                </label>

                <Controller
                  control={control}
                  name="payment_method"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full py-5.5 bg-white dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-slate-200">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        className="z-[100] bg-white dark:bg-stone-900 border-slate-200 dark:border-stone-700"
                      >
                        <SelectItem value="Cash">Cash</SelectItem>
                        <SelectItem value="GCash">GCash</SelectItem>
                        <SelectItem value="Bank">Bank Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-3 mt-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 h-11 border-slate-200 dark:border-stone-700 dark:text-slate-200 dark:hover:bg-stone-800"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="flex-1 h-11 bg-emerald-500 hover:bg-emerald-600 text-white"
                disabled={!isUpgrade || isPending }
              >
                Confirm Payment & Change Plan
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}