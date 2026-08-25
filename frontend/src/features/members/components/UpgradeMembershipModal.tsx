import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { theme } from "@/utils/theme";

interface UpgradeMembershipModalProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  member: Member | null;
}

interface ChangePlanForm {
  plan_id?: number;
  payment_method: "Cash" | "GCash" | "Bank";
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
    if (!open) return;

    reset({
      plan_id: undefined,
      payment_method: "Cash",
    });
  }, [open, member?.id, reset]);

  const selectedPlanId = watch("plan_id");

  const currentPlan = useMemo(() => {
    if (!member?.plan_id) return undefined;

    return plans.find(
      (plan: MemberPlan) => plan.id === Number(member.plan_id)
    );
  }, [plans, member?.plan_id]);

  const selectedPlan = useMemo(() => {
    if (!selectedPlanId) return undefined;

    return plans.find(
      (plan: MemberPlan) => plan.id === Number(selectedPlanId)
    );
  }, [plans, selectedPlanId]);

  const currentPrice = Number(currentPlan?.price ?? 0);
  const newPrice = Number(selectedPlan?.price ?? 0);
  const additionalAmount = Math.max(newPrice - currentPrice, 0);
  const isUpgrade = !!selectedPlan && newPrice > currentPrice;

  const availablePlans = useMemo(
    () =>
      plans.filter(
        (plan: MemberPlan) => Number(plan.price) > currentPrice
      ),
    [plans, currentPrice]
  );

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
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-white border-stone-200 dark:bg-stone-900 dark:border-stone-700">
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
            className="mt-3 flex flex-col gap-5"
          >
            <div className="rounded-xl bg-slate-50 p-4 dark:bg-stone-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Current Plan
              </p>

              <div className="mt-2 flex items-center justify-between">
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

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Available Plans
              </label>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Only membership plans with a higher price than the current
                plan are shown.
              </p>

              <Controller
                control={control}
                name="plan_id"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(value) => field.onChange(Number(value))}
                    disabled={plansLoading || availablePlans.length === 0}
                  >
                    <SelectTrigger className="w-full bg-white py-5.5 text-slate-700 border-slate-200 dark:bg-stone-800 dark:border-stone-700 dark:text-slate-200">
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
                      className="z-[100] bg-white border-slate-200 dark:bg-stone-900 dark:border-stone-700"
                    >
                      {availablePlans.map((plan: MemberPlan) => (
                        <SelectItem
                          key={plan.id}
                          value={String(plan.id)}
                        >
                          {plan.plan_name} ({plan.duration}{" "}
                          {plan.duration_type.toLowerCase()}) — ₱
                          {Number(plan.price).toLocaleString("en-PH", {
                            minimumFractionDigits: 2,
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {selectedPlan && isUpgrade && (
              <div className="space-y-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4 dark:border-emerald-900/40 dark:bg-emerald-950/20">
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

                <div className="flex items-center justify-between border-t border-emerald-200 pt-3 dark:border-emerald-900/50">
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
                      <SelectTrigger className="w-full bg-white py-5.5 text-slate-700 border-slate-200 dark:bg-stone-800 dark:border-stone-700 dark:text-slate-200">
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>

                      <SelectContent
                        position="popper"
                        className="z-[100] bg-white border-slate-200 dark:bg-stone-900 dark:border-stone-700"
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

            <div className="mt-2 flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="h-11 flex-1 border-slate-200 dark:border-stone-700 dark:text-slate-200 dark:hover:bg-stone-800"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className={`h-11 flex-1 ${theme.gradient} text-white`}
                disabled={!isUpgrade || isPending}
              >
                {isPending
                  ? "Processing..."
                  : "Confirm Payment & Change Plan"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}