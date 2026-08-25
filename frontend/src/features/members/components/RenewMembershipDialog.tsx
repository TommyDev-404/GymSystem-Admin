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
 import { useForm, Controller } from "react-hook-form";
 import { Button } from "@/components/ui/button";
 import { usePlans } from "@/features/settings/sections/membership_plans/hook/usePlan";
 import type { Member, MemberPlan } from "../types/member";
 import { useRenewMembership } from "../hooks/useMember";
 
 interface RenewMembershipDialogProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	member: Member | null;
	onRenew?: () => void;
 }
 
 type RenewForm = {
	plan_id: number;
	payment_method: "Cash" | "GCash";
 };
 
 export default function RenewMembershipDialog({
	open,
	setOpen,
	member,
	onRenew,
 }: RenewMembershipDialogProps) {
	const { data: plans = [] } = usePlans();
	const { mutate: renewMembership, isPending } = useRenewMembership();
 
	const { control, handleSubmit, reset } = useForm<RenewForm>({
	  defaultValues: {
		 plan_id: undefined,
		 payment_method: undefined,
	  },
	});
 
	const onSubmit = (data: RenewForm) => {
	  if (!member) return;
 
	  renewMembership(
		 {
			member_id: member.id!,
			plan_id: data.plan_id,
			payment_method: data.payment_method,
		 },
		 {
			onSuccess: () => {
			  reset();
			  setOpen(false);
			  onRenew?.();
			},
		 },
	  );
	};
 
	return (
	  <Dialog open={open} onOpenChange={setOpen}>
		 <DialogContent className="rounded-2xl border-stone-200 bg-white sm:max-w-md dark:border-stone-700 dark:bg-stone-900">
			<DialogHeader>
			  <DialogTitle className="text-xl font-semibold text-slate-800 dark:text-slate-100">
				 Renew Membership
			  </DialogTitle>
			</DialogHeader>
 
			<div className="mt-3 flex flex-col gap-5">
			  <div className="space-y-4">
				 <p className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
					Member Information
				 </p>
 
				 <div className="rounded-xl bg-slate-50 p-4 dark:bg-stone-800">
					<p className="font-medium text-slate-800 dark:text-slate-100">
					  {member?.fullname}
					</p>
					<p className="text-sm text-slate-500 dark:text-slate-400">
					  Current Plan: {member?.plan_name ?? "None"}
					</p>
				 </div>
			  </div>
 
			  <div className="space-y-1.5">
				 <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
					Select New Plan
				 </label>
 
				 <Controller
					control={control}
					name="plan_id"
					rules={{ required: "Plan is required" }}
					render={({ field }) => (
					  <Select
						 value={field.value ? String(field.value) : ""}
						 onValueChange={(value) => field.onChange(Number(value))}
					  >
						 <SelectTrigger className="w-full border-slate-200 bg-white py-5.5 text-slate-700 transition-all duration-200 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200">
							<SelectValue placeholder="Select membership plan" />
						 </SelectTrigger>
 
						 <SelectContent
							position="popper"
							className="z-[100] border-slate-200 bg-white dark:border-stone-700 dark:bg-stone-900"
						 >
							{plans.map((plan: MemberPlan) => (
							  <SelectItem
								 key={plan.id}
								 value={String(plan.id)}
								 className="cursor-pointer transition-colors duration-150"
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
 
			  <div className="space-y-1.5">
				 <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
					Payment Method
				 </label>
 
				 <Controller
					control={control}
					name="payment_method"
					rules={{ required: "Payment method is required" }}
					render={({ field }) => (
					  <Select
						 value={field.value}
						 onValueChange={field.onChange}
					  >
						 <SelectTrigger className="w-full border-slate-200 bg-white py-5.5 text-slate-700 transition-all duration-200 dark:border-stone-700 dark:bg-stone-800 dark:text-slate-200">
							<SelectValue placeholder="Select payment method" />
						 </SelectTrigger>
 
						 <SelectContent
							position="popper"
							className="z-[100] border-slate-200 bg-white dark:border-stone-700 dark:bg-stone-900"
						 >
							<SelectItem
							  value="Cash"
							  className="cursor-pointer transition-colors duration-150"
							>
							  Cash
							</SelectItem>
 
							<SelectItem
							  value="GCash"
							  className="cursor-pointer transition-colors duration-150"
							>
							  GCash
							</SelectItem>
						 </SelectContent>
					  </Select>
					)}
				 />
			  </div>
 
			  <div className="mt-3 flex gap-3">
				 <Button
					type="button"
					variant="outline"
					className="h-11 flex-1 border-slate-200 dark:border-stone-700 dark:text-slate-200 dark:hover:bg-stone-800"
					onClick={() => setOpen(false)}
				 >
					Cancel
				 </Button>
 
				 <Button
					type="button"
					className="h-11 flex-1 bg-[#963348] text-white hover:bg-[#7A1F31]"
					disabled={isPending}
					onClick={handleSubmit(onSubmit)}
				 >
					{isPending ? "Renewing..." : "Renew"}
				 </Button>
			  </div>
			</div>
		 </DialogContent>
	  </Dialog>
	);
 }