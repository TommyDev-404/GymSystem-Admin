import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Rewards } from "../types/RewardsType";
import { useCreateReward, useUpdateReward } from "../hook/useRewards";
import { theme } from "@/utils/theme";

interface Props {
  reward?: Rewards;
  open: boolean;
  onClose: () => void;
}

const CATEGORIES = ["Fitness", "Nutrition", "Loyalty", "Special", "Custom"];

type RewardForm = Omit<Rewards, "id"> & {
  customCategory: string;
};

const defaultValues: RewardForm = {
  name: "",
  description: "",
  points_required: 0,
  category: "",
  customCategory: "",
};

export function RewardModal({ reward, open, onClose }: Props) {
  const { mutate: createReward, isPending: creating } = useCreateReward();
  const { mutate: updateReward, isPending: updating } = useUpdateReward();

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { dirtyFields },
  } = useForm<RewardForm>({
    defaultValues,
  });

  const selectedCategory = watch("category");
  const isPending = creating || updating;

  useEffect(() => {
    if (reward) {
      const isCustomCategory = !CATEGORIES.includes(reward.category);

      reset({
        name: reward.name,
        description: reward.description,
        points_required: reward.points_required,
        category: isCustomCategory ? "Custom" : reward.category,
        customCategory: isCustomCategory ? reward.category : "",
      });
      return;
    }

    reset(defaultValues);
  }, [reward, reset]);

  useEffect(() => {
    if (!open && !reward) {
      reset(defaultValues);
    }
  }, [open, reward, reset]);

  const onSubmit = (data: RewardForm) => {
    const finalCategory =
      data.category === "Custom"
        ? data.customCategory.trim()
        : data.category;

    if (!finalCategory) {
      toast.error("Please specify a category.");
      return;
    }

    if (reward) {
      const updatedData: Partial<Rewards> = {};

      Object.keys(dirtyFields).forEach((key) => {
        if (key === "category" || key === "customCategory") {
          updatedData.category = finalCategory;
          return;
        }

        updatedData[key as keyof Rewards] =
          data[key as keyof RewardForm] as never;
      });

      updateReward(
        {
          id: reward.id,
          data: updatedData,
        },
        {
          onSuccess: () => {
            toast.success("Reward updated successfully!");
            onClose();
          },
        }
      );

      return;
    }

    createReward({
      ...data,
      category: finalCategory,
	 }, {
		 onSuccess: () => {
			 onClose();
		 }
	 });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-2xl bg-white border-stone-200 dark:bg-stone-900 dark:border-stone-700">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            {reward ? "Update Reward" : "Create New Reward"}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-3 flex flex-col gap-5"
        >
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Reward Details
            </p>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Reward Title
              </label>

              <Input
                {...register("name")}
                placeholder="e.g. Free Protein Shake"
                className="h-11 bg-white border-slate-200 text-slate-700 dark:bg-stone-800 dark:border-stone-700 dark:text-slate-200"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Description
              </label>

              <Textarea
                {...register("description")}
                rows={3}
                placeholder="Brief description..."
                className="resize-none bg-white border-slate-200 text-slate-700 dark:bg-stone-800 dark:border-stone-700 dark:text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
              Redemption
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Points Required
                </label>

                <Input
                  type="number"
                  min={0}
                  placeholder="Points"
                  {...register("points_required", {
                    valueAsNumber: true,
                  })}
                  className="h-11 bg-white border-slate-200 text-slate-700 dark:bg-stone-800 dark:border-stone-700 dark:text-slate-200"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Category
                </label>

                <Controller
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="w-full bg-white py-5.5 border-slate-200 text-slate-700 dark:bg-stone-800 dark:border-stone-700 dark:text-slate-200">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>

                      <SelectContent className="bg-white border-slate-200 dark:bg-stone-900 dark:border-stone-700">
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category === "Custom"
                              ? "+ Custom"
                              : category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />

                {selectedCategory === "Custom" && (
                  <Input
                    {...register("customCategory", {
                      required: "Please specify a category",
                    })}
                    placeholder="e.g. Merchandise"
                    className="mt-2 h-11 bg-white border-slate-200 text-slate-700 dark:bg-stone-800 dark:border-stone-700 dark:text-slate-200"
                  />
                )}
              </div>
            </div>
          </div>

          <div className="mt-3 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="h-11 flex-1 border-slate-200 dark:border-stone-700 dark:text-slate-200 dark:hover:bg-stone-800"
            >
              Cancel
            </Button>

            <Button
						  type="submit"
						  disabled={isPending}
						  className={`h-11 flex-1 ${theme.gradient} text-white`}
            >
              {isPending
                ? reward
                  ? "Updating..."
                  : "Creating..."
                : reward
                  ? "Save Changes"
                  : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}