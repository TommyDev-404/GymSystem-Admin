import { useForm, Controller } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreatePlan } from "../sections/membership_plans/hook/usePlan";
import type { CreatePlanDTO } from "../sections/membership_plans/types/plans.types";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddPlanModal({
  open,
  onClose
}: Props) {
  const { mutate: createPlan, isPending } = useCreatePlan();

  const {
    register,
    handleSubmit,
    control,
    reset,
  } = useForm<CreatePlanDTO>({
    defaultValues: {
      plan_name: "",
      price: 0,
      duration: 1,
      duration_type: "Month",
    },
  });

  const submit = (data: CreatePlanDTO) => {
    createPlan(data, {
      onSuccess: () => {
        toast.success("Plan created successfully.");
        onClose();
      }
    });
    reset();
    onClose();
  };

  const closeModal = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={closeModal}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-800">
            Create New Plan
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submit)}
          className="flex flex-col gap-4 mt-2"
        >
          {/* PLAN NAME */}
          <div className="flex flex-col gap-1">

            <label className="text-sm text-slate-600">
              Plan Name
            </label>

            <Input
              placeholder="e.g. Premium Plan"
              {...register("plan_name")}
            />

          </div>

          {/* PRICE */}
          <div className="flex flex-col gap-1">

            <label className="text-sm text-slate-600">
              Price
            </label>

            <Input
              type="number"
              placeholder="Enter price"
              {...register("price", {
                valueAsNumber: true,
              })}
            />

          </div>

          {/* DURATION + TYPE */}
          <div className="grid grid-cols-2 gap-3">

            {/* DURATION */}
            <div className="flex flex-col gap-1">

              <label className="text-sm text-slate-600">
                Duration
              </label>

              <Input
                type="number"
                placeholder="e.g. 2"
                {...register("duration", {
                  valueAsNumber: true,
                })}
              />

            </div>

            {/* TYPE */}
            <div className="flex flex-col gap-1">

              <label className="text-sm text-slate-600">
                Type
              </label>

              <Controller
                name="duration_type"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
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

          {/* ACTIONS */}
          <div className="flex gap-3 mt-6">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={closeModal}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}