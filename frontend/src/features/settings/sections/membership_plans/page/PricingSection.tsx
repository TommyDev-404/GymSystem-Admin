import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { CreditCard, Loader2, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AddPlanModal } from "@/features/settings/components/PlanModal";
import { ConfirmationDialog } from "@/components/shared/ConfirmationDialog";

import { useDeletePlan, usePlans, useUpdatePlan } from "../hook/usePlan";
import type { Plan, UpdatePlanDTO } from "../types/plans.types";
import { Loader } from "@/components/shared/Loader";
import { useSearchParams } from "react-router-dom";

type FormValues = {
  plans: Plan[];
};

export function PricingSection() {
  const [searchParams] = useSearchParams();

  const urlAction = searchParams.get("action");

  const { data: plansData = [], isLoading } = usePlans();
  const { mutate: deletePlan, isPending: deleting } = useDeletePlan();
  const { mutate: updatePlan, isPending: updating } = useUpdatePlan();

  const [open, setOpen] = useState<"Add" | "Delete" | null>(urlAction === 'add' ? "Add" : null);
  const [selectedPlan, setSelectedPlan] = useState<{ id: number, name: string } | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { dirtyFields }
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
    const updates = data.plans.map((plan, index) => {
      const dirty = dirtyFields.plans?.[index];

      if (!dirty) return null;

      const changedData: Partial<Plan> = {};

      Object.keys(dirty).forEach((key) => {
        changedData[key as keyof Plan] =
          plan[key as keyof Plan];
      });

      return {
        id: plan.id,
        data: changedData
      };
    }).filter(
      (item): item is UpdatePlanDTO => item !== null
    );
  
    updatePlan({ data: updates }, {
      onSuccess: () => {
        toast.success("Plans updated successfully!");
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-800">
            Membership Pricing
          </h3>

          <p className="text-sm text-slate-500">
            Manage membership plans and pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleAdd}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Plan
          </Button>

          <Button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600"
            disabled={updating}
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

      {/* Plans */}
      <div className="space-y-4">
        {isLoading ? (
          <Loader/>
        ):
          fields.length > 0 ?
            fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-xl border border-slate-200 p-5"
              >
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-slate-800">
                      {field.plan_name}
                    </h4>

                    <p className="text-sm text-slate-500">
                      Edit membership details
                    </p>
                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                      setSelectedPlan({ id: field.id, name: field.plan_name });
                      setOpen("Delete");
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {/* Price */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">
                      Price (₱)
                    </label>

                    <Input
                      type="number"
                      {...register(`plans.${index}.price`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  {/* Duration */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">
                      Duration
                    </label>

                    <Input
                      type="number"
                      {...register(`plans.${index}.duration`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  {/* Duration Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-600">
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
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>

                          <SelectContent>
                            <SelectItem value="Day">
                              Day
                            </SelectItem>

                            <SelectItem value="Week">
                              Week
                            </SelectItem>

                            <SelectItem value="Month">
                              Month
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
              </div>
            ))
        : (
          <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <CreditCard className="h-7 w-7 text-slate-400" />
            </div>
          
            <h3 className="text-sm font-semibold text-slate-700">
              No pricing plans yet
            </h3>
          
            <p className="mt-1 max-w-xs text-sm text-slate-400">
              Add membership plans to start managing your gym pricing.
            </p>
          </div>
        )}
      </div>

      {/* Add Plan */}
      <AddPlanModal
        open={open === "Add"}
        onClose={() => setOpen(null)}
      />

      {/* Delete */}
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
  );
}