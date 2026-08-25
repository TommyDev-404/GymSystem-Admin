import { toast } from "sonner";
import { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
import type {
  AddMemberFormType,
  MemberPlan,
} from "@/features/members/types/member";
import { useCreateMember } from "../hooks/useMember";
import { usePlans } from "@/features/settings/sections/membership_plans/hook/usePlan";
import { theme } from "@/utils/theme";

interface Props {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export function MemberModal({ open, setOpen }: Props) {
  const { mutate: createMember, isPending: creating } = useCreateMember();

  const { data: plans = [] } = usePlans();

  const { register, handleSubmit, control, reset, watch } =
    useForm<AddMemberFormType>({
      defaultValues: {
        fullname: "",
        email: "",
        age: 0,
        gender: undefined,
        plan_id: undefined,
        referral_code: "",
        payment_method: undefined,
      },
    });

  const selectedPlanId = watch("plan_id");
  const selectedPlan = plans.find(
    (plan: MemberPlan) => plan.id === Number(selectedPlanId)
  );

  useEffect(() => {
    if (!open) {
      reset({
        fullname: "",
        email: "",
        age: 0,
        gender: undefined,
        plan_id: undefined,
        referral_code: "",
        payment_method: undefined,
      });
    }
  }, [open, reset]);

  const onSubmit = (data: AddMemberFormType) => {
    createMember(data, {
      onSuccess: () => {
        toast.success("Member created successfully");
        setOpen(false);
        reset();
      },
      onError: () => {
        toast.error("Failed to create member");
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md max-h-[90vh] rounded-2xl bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-700 flex flex-col overflow-hidden">
        {/* HEADER */}
        <DialogHeader className="shrink-0">
          <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
            Add Member
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col min-h-0 flex-1"
        >
          <div className="flex-1 min-h-0 overflow-y-auto pr-2 space-y-5 mt-3 pb-4 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-stone-700">
            {/* PERSONAL INFORMATION*/}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Personal Information
              </p>

              {/* NAME */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Full Name
                </label>
                <Input
                  {...register("fullname")}
                  placeholder="Enter full name"
                  className="h-11 bg-white dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-slate-200"
                />
              </div>

              {/* EMAIL */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Email Address
                </label>
                <Input
                  {...register("email")}
                  placeholder="example@email.com"
                  className="h-11 bg-white dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-slate-200"
                />
              </div>

              {/* AGE + GENDER */}
              <div className="grid grid-cols-2 gap-3">
                {/* AGE */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Age
                  </label>
                  <Input
                    type="number"
                    placeholder="Age"
                    {...register("age", { valueAsNumber: true })}
                    className="h-11 bg-white dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-slate-200"
                  />
                </div>

                {/* GENDER */}
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Gender
                  </label>
						
                  <Controller
							control={control}
							name="gender"
							render={({ field }) => (
								<Select
									value={field.value}
									onValueChange={field.onChange}
								>
									<SelectTrigger className="w-full py-5.5 bg-white dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-slate-200">
										<SelectValue placeholder="Select gender" />
									</SelectTrigger>

									<SelectContent
										position="popper"
										className="z-[100] bg-white dark:bg-stone-900 border-slate-200 dark:border-stone-700"
									>
										<SelectItem value="Male">Male</SelectItem>
										<SelectItem value="Female">Female</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
                </div>
              </div>

              {/* REFERRAL CODE */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Referral Code
                </label>
                <Input
                  {...register("referral_code")}
                  placeholder="Enter referral code (optional)"
                  className="h-11 bg-white dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-slate-200"
                />
              </div>
            </div>

            {/* MEMBERSHIP */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                Membership
              </p>

              {/* PLAN */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Membership Plan
							  </label>
							  
                <Controller
						control={control}
						name="plan_id"
						render={({ field }) => (
							<Select
								value={field.value ? String(field.value) : ""}
								onValueChange={(value) => field.onChange(Number(value))}
							>
								<SelectTrigger className="w-full py-5.5 bg-white dark:bg-stone-800 border-slate-200 dark:border-stone-700 text-slate-700 dark:text-slate-200">
									<SelectValue placeholder={plans.length > 0 ? "Select membership plan" : "No available membership plan"} />
								</SelectTrigger>

								<SelectContent
									position="popper"
									className="z-[100] bg-white dark:bg-stone-900 border-slate-200 dark:border-stone-700 py-2"
								>
									{plans.map((p: MemberPlan) => (
										<SelectItem key={p.id} value={String(p.id)}>
											{p.plan_name} ({p.duration} {p.duration_type.toLowerCase()}) — ₱{Number(p.price).toLocaleString("en-PH", { minimumFractionDigits: 2 })}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
					/>
              </div>

              {/* AMOUNT TO PAY */}
              {selectedPlan && (
                <div className="rounded-xl border border-emerald-100 dark:border-emerald-900/40 bg-emerald-50 dark:bg-emerald-950/20 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        Amount to Pay
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                        {selectedPlan.plan_name}
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      ₱
                      {Number(selectedPlan.price).toLocaleString("en-PH", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              )}

              {/* PAYMENT METHOD */}
              {selectedPlan && (
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
            </div>
          </div>

          {/* FIXED ACTIONS */}
          <div className="shrink-0 flex gap-3 pt-4 mt-1 border-t border-slate-100 dark:border-stone-800 bg-white dark:bg-stone-900">
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
						  className={`flex-1 h-11 ${theme.gradient} text-white`}
              disabled={creating || !selectedPlan}
            >
              {creating ? "Adding..." : "Add Member"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}