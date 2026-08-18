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
import { useForm, Controller } from "react-hook-form";
import type { Rewards } from "../types/RewardsType";
import { useCreateReward, useUpdateReward } from "../hook/useRewards";
import { toast } from "sonner";
import { useEffect } from "react";

interface Props {
	reward?: Rewards;
	open: boolean;
	onClose: () => void;
}

const CATEGORIES = ["Fitness", "Nutrition", "Loyalty", "Special", "Custom"];
 
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
		control,
		watch,
		formState: { dirtyFields }
	} = useForm<Omit<Rewards, "id"> & { customCategory: string }>({
		defaultValues: {
			name: "",
			description: "",
			points_required: 0,
			category: undefined,
			customCategory: "",
		},
	});
	
	const selectedCategory = watch("category");

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
		} else {
			reset({
				name: "",
				description: "",
				points_required: 0,
				category: undefined,
				customCategory: "",
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
				customCategory: "",
			});
		}
	}, [open, reward, reset]);
	
	const onSubmit = (data: Omit<Rewards, "id"> & { customCategory: string }) => {
		const finalCategory = data.category === "Custom"
				? data.customCategory.trim()
				: data.category;
	
		if (!finalCategory) {
			toast.error("Please specify a category.");
			return;
		}
	
		if (reward) {
			const updatedData: Partial<Rewards> = {};
	
			Object.keys(dirtyFields).forEach((key) => {
				if (
					key === "category" ||
					key === "customCategory"
				) {
					updatedData.category = finalCategory;
				} else {
					updatedData[key as keyof Rewards] =
						data[key as keyof typeof data] as never;
				}
			});
	
			updateData(
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
		});
	};

	const isPending = creating || updating;

	return (
		<Dialog open={open} onOpenChange={onClose}>
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
						{!reward ? "Create New Reward" : "Update Reward"}
					</DialogTitle>
				</DialogHeader>

				{/* FORM */}
				<form
					onSubmit={handleSubmit(onSubmit)}
					className="
						flex
						flex-col
						gap-5
						mt-3
					"
				>
					{/* REWARD DETAILS */}
					<div className="space-y-4">
						<p className="
							text-xs
							font-semibold
							uppercase
							tracking-wide
							text-slate-400
							dark:text-slate-500
						">
							Reward Details
						</p>

						{/* TITLE */}
						<div className="space-y-1.5">
							<label
								className="
									text-sm
									font-medium
									text-slate-700
									dark:text-slate-200
								"
							>
								Reward Title
							</label>

							<Input
								{...register("name")}
								placeholder="e.g. Free Protein Shake"
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

						{/* DESCRIPTION */}
						<div className="space-y-1.5">
							<label
								className="
									text-sm
									font-medium
									text-slate-700
									dark:text-slate-200
								"
							>
								Description
							</label>

							<Textarea
								rows={3}
								{...register("description")}
								placeholder="Brief description..."
								className="
									bg-white
									dark:bg-stone-800
									border-slate-200
									dark:border-stone-700
									text-slate-700
									dark:text-slate-200
									resize-none
								"
							/>
						</div>
					</div>

					{/* REDEMPTION */}
					<div className="space-y-4">
						<p className="
							text-xs
							font-semibold
							uppercase
							tracking-wide
							text-slate-400
							dark:text-slate-500
						">
							Redemption
						</p>

						<div className="grid grid-cols-2 gap-3">
							{/* POINTS REQUIRED */}
							<div className="space-y-1.5">
								<label
									className="
										text-sm
										font-medium
										text-slate-700
										dark:text-slate-200
									"
								>
									Points Required
								</label>

								<Input
									type="number"
									min={0}
									placeholder="Points"
									{...register("points_required", { valueAsNumber: true })}
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

							{/* CATEGORY */}
							<div className="space-y-1.5">
								<label
									className="
										text-sm
										font-medium
										text-slate-700
										dark:text-slate-200
									"
								>
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
											<SelectTrigger
												className="
													bg-white
													dark:bg-stone-800
													border-slate-200
													dark:border-stone-700
													text-slate-700
													dark:text-slate-200
													w-full
													py-5.5
												"
											>
												<SelectValue placeholder="Select category" />
											</SelectTrigger>

											<SelectContent
												className="
													bg-white
													dark:bg-stone-900
													border-slate-200
													dark:border-stone-700
												"
											>
												{CATEGORIES.map((c) => (
													<SelectItem key={c} value={c}>
														{c === "Custom" ? "+ Custom" : c}
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
										className="
											h-11
											mt-2
											bg-white
											dark:bg-stone-800
											border-slate-200
											dark:border-stone-700
											text-slate-700
											dark:text-slate-200
										"
									/>
								)}
							</div>
						</div>
					</div>

					{/* ACTIONS */}
					<div className="
						flex
						gap-3
						mt-3
					">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
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
							{
							isPending
							? reward
								? "Updating..."
								: "Creating..."
							: reward
							? "Save Changes"
							: "Create"
							}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}