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
  onClose,
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
    <Dialog open={open} onOpenChange={closeModal}>
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
            Create New Plan
          </DialogTitle>
        </DialogHeader>


        <form
          onSubmit={handleSubmit(submit)}
          className="
            flex
            flex-col
            gap-5
            mt-3
          "
        >

          {/* PLAN INFORMATION */}
          <div className="space-y-4">

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
                dark:text-slate-500
              "
            >
              Membership Information
            </p>


            {/* PLAN NAME */}
            <div className="space-y-1.5">

              <label
                className="
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-200
                "
              >
                Plan Name
              </label>

              <Input
                placeholder="e.g. Premium Plan"
                {...register("plan_name")}
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


            {/* PRICE */}
            <div className="space-y-1.5">

              <label
                className="
                  text-sm
                  font-medium
                  text-slate-700
                  dark:text-slate-200
                "
              >
                Price (₱)
              </label>

              <Input
                type="number"
                placeholder="Enter price"
                {...register("price", {
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


            {/* DURATION */}
            <div className="grid grid-cols-2 gap-3">

              <div className="space-y-1.5">

                <label
                  className="
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                >
                  Duration
                </label>

                <Input
                  type="number"
                  placeholder="e.g. 2"
                  {...register("duration", {
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


              {/* TYPE */}
              <div className="space-y-1.5">

                <label
                  className="
                    text-sm
                    font-medium
                    text-slate-700
                    dark:text-slate-200
                  "
                >
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

                      <SelectTrigger
                        className="
                          h-11
                          bg-white
                          dark:bg-stone-800
                          border-slate-200
                          dark:border-stone-700
                          text-slate-700
                          dark:text-slate-200
                          w-full
                          py-5
                        "
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>


                      <SelectContent
                        className="
                          bg-white
                          dark:bg-stone-900
                          border-slate-200
                          dark:border-stone-700
                        "
                      >

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


          {/* ACTIONS */}
          <div
            className="
              flex
              gap-3
              mt-3
            "
          >

            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
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
              {isPending
                ? "Creating..."
                : "Create"}
            </Button>

          </div>

        </form>

      </DialogContent>
    </Dialog>
  );
}