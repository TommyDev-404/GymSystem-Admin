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
import { theme } from "@/utils/theme";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AddPlanModal({ open, onClose }: Props) {
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
        reset();
        onClose();
      },
    });
  };

  const closeModal = () => {
    reset();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) closeModal();
      }}
    >
      <DialogContent className="rounded-2xl border-[#E8C7CC] bg-white sm:max-w-md dark:border-stone-700 dark:bg-stone-900">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Create New Plan
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(submit)}
          className="mt-3 flex flex-col gap-5"
        >
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8B1E2D] dark:text-[#A92B3D]">
              Membership Information
            </p>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Plan Name
              </label>
              <Input
                placeholder="e.g. Premium Plan"
                {...register("plan_name")}
                className="h-11 border-slate-200 bg-white text-slate-700 focus-visible:border-[#8B1E2D] focus-visible:ring-[#8B1E2D]/20 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Price (₱)
              </label>
              <Input
                type="number"
                placeholder="Enter price"
                {...register("price", {
                  valueAsNumber: true,
                })}
                className="h-11 border-slate-200 bg-white text-slate-700 focus-visible:border-[#8B1E2D] focus-visible:ring-[#8B1E2D]/20 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Duration
                </label>
                <Input
                  type="number"
                  placeholder="e.g. 2"
                  {...register("duration", {
                    valueAsNumber: true,
                  })}
                  className="h-11 border-slate-200 bg-white text-slate-700 focus-visible:border-[#8B1E2D] focus-visible:ring-[#8B1E2D]/20 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Duration Type
                </label>
                <Controller
                  name="duration_type"
                  control={control}
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-11 w-full border-slate-200 bg-white text-slate-700 focus:ring-[#8B1E2D]/20 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="border-[#E8C7CC] bg-white dark:border-stone-700 dark:bg-stone-900">
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

          <div className="mt-3 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              className="h-11 flex-1 border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-stone-700 dark:text-slate-200 dark:hover:bg-stone-800"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
              className={`h-11 flex-1 ${theme.gradient} text-white`}
            >
              {isPending ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}