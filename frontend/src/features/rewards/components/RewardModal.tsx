import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";;

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import type { Rewards } from "../types/RewardsType";
import { useCreateReward, useUpdateReward } from "../hook/useRewards";
import { toast } from "sonner";
import { useEffect } from "react";

interface Props {
  reward?: Rewards;
  open: boolean;
  onClose: () => void;
}

export function RewardModal({
	reward,
	open,
	onClose
}: Props) {

	const { mutate: createReward, isPending: creating } = useCreateReward();
	const { mutate: updateData, isPending: updating } = useUpdateReward();

	const {
		register,
		handleSubmit,
		reset,
		formState: { dirtyFields }
	} = useForm<Omit<Rewards, "id">>({
		defaultValues: {
		name: "",
		description: "",
		points_required: 0,
		category: undefined,
		},
	});

	useEffect(() => {
		if (reward) {
		reset({
			name: reward.name,
			description: reward.description,
			points_required: reward.points_required,
			category: reward.category,
		});
		} else {
		reset({
			name: "",
			description: "",
			points_required: 0,
			category: undefined,
		});
		}
	}, [reward, reset]);

	// clear the form when modal is closed (for add modal only)
	useEffect(() => {
		if (!open && !reward) {
			reset({
			name: "",
			description: "",
			points_required: 0,
			category: undefined,
			});
		}
	}, [open]);

	const onSubmit = (data: Omit<Rewards, "id">) => {
		if (reward) {
			const updatedData: Partial<Rewards> = {};

			Object.keys(dirtyFields).forEach((key) => {
			updatedData[key as keyof Rewards] = data[key as keyof Reward];
			});

			return updateData({ id: reward.id, data: updatedData }, {
			onSuccess: () => {
				toast.success("Reward updated successfully!");
				onClose();
			}
			})
		}

		console.log("Create process...");

		createReward(data, {
			onSuccess: () => {
			toast.success("Reward created successfully!");
			onClose();
			}
		})
	};

	const isPending = creating || updating;

	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent className="p-0 overflow-hidden max-w-md">
				{/* HEADER (custom styled, not shadcn default) */}
				<DialogTitle>
					<div className="flex items-center justify-between px-6 pt-6 mb-5">
						<h2 className="text-slate-800 font-semibold">
						{!reward ? "Create New Reward" : "Update Reward"}
						</h2>
					</div>
				</DialogTitle>

				{/* BODY */}
				<div className="px-6 space-y-4">
					{/* Title */}
					<div>
						<label className="text-slate-600 text-sm mb-1 block">
						Reward Title
						</label>
						<Input
						className="rounded-xl border-slate-200 focus:ring-2 focus:ring-emerald-400"
						{...register("name")}
						placeholder="e.g. Free Protein Shake"
						/>
					</div>

					{/* Description */}
					<div>
						<label className="text-slate-600 text-sm mb-1 block">
						Description
						</label>
						<Textarea
						className="rounded-xl border-slate-200 focus:ring-2 focus:ring-emerald-400 resize-none"
						rows={2}
						{...register("description")}
						placeholder="Brief description..."
						/>
					</div>

					{/* Grid */}
					<div className="grid grid-cols-2 gap-3">
						<div>
						<label className="text-slate-600 text-sm mb-1 block">
							Points Required
						</label>
						<Input
							type="number"
							className="rounded-xl border-slate-200 focus:ring-2 focus:ring-emerald-400"
							{...register("points_required", { valueAsNumber: true })}
						/>
						</div>

						<div>
						<label className="text-slate-600 text-sm mb-1 block">
							Category
						</label>
						<select
							className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
							{...register("category")}
						>
							<option>Fitness</option>
							<option>Nutrition</option>
							<option>Loyalty</option>
							<option>Special</option>
						</select>
						</div>
					</div>
				</div>

				{/* FOOTER */}
				<div className="flex gap-3 mt-6 px-6 pb-6">
					<button
						onClick={onClose}
						className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50"
					>
						Cancel
					</button>

					<button
						onClick={handleSubmit(onSubmit)}
						disabled={isPending}
						className="flex-1 px-4 py-2.5 rounded-xl bg-emerald-500 text-white text-sm font-medium hover:bg-emerald-600"
					>
						{
						isPending
						? reward
							? "Updating..."
							: "Creating..."
						: reward
						? "Update"
						: "Create"
						}
						
					</button>
				</div>
			</DialogContent>
		</Dialog>
	);
}