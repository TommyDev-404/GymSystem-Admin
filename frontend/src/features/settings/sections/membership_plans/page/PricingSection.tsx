import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { CreditCard, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddPlanModal } from "@/features/settings/components/PlanModal";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";
import { Loader } from "@/components/shared/Loader";
import { useDeletePlan, usePlans, useUpdatePlan } from "../hook/usePlan";
import type { Plan, UpdatePlanDTO } from "../types/plans.types";

type FormValues = {
  plans: Plan[];
};

export function PricingSection() {
  const [searchParams] = useSearchParams();
  const urlAction = searchParams.get("action");

  const { data: plansData = [], isLoading } = usePlans();
  const { mutate: deletePlan, isPending: deleting } = useDeletePlan();
  const { mutate: updatePlan, isPending: updating } = useUpdatePlan();

  const [open, setOpen] = useState<"Add" | "Delete" | null>(
    urlAction === "add" ? "Add" : null
  );
  const [selectedPlan, setSelectedPlan] = useState<{
    id: number;
    name: string;
  } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields },
  } = useForm<FormValues>({
    defaultValues: {
      plans: [],
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "plans",
    keyName: "fieldId",
  });

  useEffect(() => {
    reset({
      plans: plansData,
    });
  }, [plansData, reset]);

  const handleAdd = () => {
    setOpen("Add");
  };

  const onSubmit = (data: FormValues) => {
    const updates = data.plans
      .map((plan, index) => {
        const dirty = dirtyFields.plans?.[index];

        if (!dirty) return null;

        const changedData: Partial<Plan> = {};

        Object.keys(dirty).forEach((key) => {
          const field = key as keyof Plan;
          changedData[field] = plan[field];
        });

        return {
          id: plan.id,
          data: changedData,
        };
      })
      .filter(
        (item): item is UpdatePlanDTO => item !== null
      );

    updatePlan(
      { data: updates },
      {
        onSuccess: () => {
          toast.success("Plans updated successfully!");
        },
      }
    );
  };

  return (
    <Card className="rounded-2xl border-stone-200 bg-white shadow-sm dark:border-stone-700 dark:bg-stone-900">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Membership Pricing
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Manage membership plans and pricing.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleAdd}
              className="border-slate-200 dark:border-stone-700 dark:text-slate-200"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Plan
            </Button>

            <Button
              type="submit"
              disabled={updating}
              className="bg-[#8B1E2D] text-white hover:bg-[#6D1825]"
            >
              {updating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            <Loader />
          ) : fields.length > 0 ? (
            fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-slate-200 bg-white p-5 dark:border-stone-700 dark:bg-stone-800/50"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-100">
                      {field.plan_name}
                    </h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Edit membership details
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedPlan({
                        id: field.id,
                        name: field.plan_name,
                      });
                      setOpen("Delete");
                    }}
                    className="hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Price (₱)
                    </label>
                    <Input
                      type="number"
                      {...register(`plans.${index}.price`, {
                        valueAsNumber: true,
                      })}
                      className="h-11 border-slate-200 bg-white dark:border-stone-700 dark:bg-stone-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Duration
                    </label>
                    <Input
                      type="number"
                      {...register(`plans.${index}.duration`, {
                        valueAsNumber: true,
                      })}
                      className="h-11 border-slate-200 bg-white dark:border-stone-700 dark:bg-stone-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Duration Type
                    </label>

                    <Controller
                      control={control}
                      name={`plans.${index}.duration_type`}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-11 border-slate-200 bg-white text-slate-700 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200">
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent className="border-slate-200 bg-white dark:border-stone-700 dark:bg-stone-900">
                            <SelectItem value="Day">Day</SelectItem>
                            <SelectItem value="Week">Week</SelectItem>
                            <SelectItem value="Month">Month</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#8B1E2D]/10 dark:bg-[#8B1E2D]/20">
                <CreditCard className="h-8 w-8 text-[#8B1E2D]" />
              </div>

              <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                No pricing plans yet
              </h3>

              <p className="mt-1 max-w-xs text-sm text-slate-400 dark:text-slate-500">
                Add membership plans to start managing your gym pricing.
              </p>
            </div>
          )}
        </div>

        <AddPlanModal
          open={open === "Add"}
          onClose={() => setOpen(null)}
        />

        <ConfirmationDialog
          open={open === "Delete"}
          name={selectedPlan?.name}
          type="Plan"
          onClose={() => setOpen(null)}
          isPending={deleting}
          onConfirm={() => {
            if (!selectedPlan) return;

            deletePlan(selectedPlan.id, {
              onSuccess: () => {
                toast.success("Plan removed successfully!");
                setOpen(null);
              },
            });
          }}
        />
      </form>
    </Card>
  );
}