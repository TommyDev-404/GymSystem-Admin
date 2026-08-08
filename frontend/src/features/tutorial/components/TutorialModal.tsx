import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ImageIcon, Plus, X } from "lucide-react";

import { useCreateTutorial, useUpdateTutorial } from "../hook/useTutorial";

import type {
	Workout,
	WorkoutForm,
} from "../types/TutorialType";
import { toast } from "sonner";
import { parseYouTubeId, ytThumb } from "@/utils/ytParser";
import { CATEGORIES, EQUIPMENT_OPTIONS, LEVELS, MUSCLES_TARGETED } from "../constants/TutorialConstants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ModalType {
	open:boolean;
	initial?:Workout|null;
	onClose:()=>void;
}

export function TutorialModal({
	open,
	initial,
	onClose
}: ModalType) {
	const { mutate: createTutorial, isPending: isCreating } = useCreateTutorial();
	const { mutate: updateTutorial, isPending: isUpdating} = useUpdateTutorial();

	const isPending = isCreating || isUpdating;

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		watch,
		formState: { dirtyFields }
	} = useForm<WorkoutForm>({
		defaultValues: {
			name: "",
			category: "",
			level: "",
			video_url: "",
			instructions: "",
			equipment: [],
			muscles_targeted: [],
			demo_images: []
		}
	});

	const category = watch("category");
	const video = watch("video_url");
	const equipment = watch("equipment") || [];
	const muscles = watch("muscles_targeted") || [];

	const videoId = parseYouTubeId(video);
	const fileRef = useRef<HTMLInputElement | null>(null);

	const [videoInput, setVideoInput] = useState("");
	const [files, setFiles] = useState<File[]>([]);
	const [existingImages, setExistingImages] = useState<string[]>([]);

	const [customEquipment, setCustomEquipment] = useState("");
	const [customMuscle, setCustomMuscle] = useState("");
	const [customEquipments, setCustomEquipments] = useState<string[]>([]);
	const [customMuscles, setCustomMuscles] = useState<string[]>([]);
	const [customCategory, setCustomCategory] = useState(false);

	const [showEquipment, setShowEquipment] = useState(false);
	const [showMuscle, setShowMuscle] = useState(false);

	useEffect(() => {
		if (initial) {
			const { ...data } = initial;

			reset({...data, demo_images: []});

			setVideoInput(data.video_url);
			setExistingImages(data.demo_images || []);
			setFiles([]);
			
			setCustomCategory(
				!CATEGORIES.includes(data.category)
			);
		
			setCustomEquipments(
				data.equipment.filter(
					x => !EQUIPMENT_OPTIONS.includes(x)
				)
			);
		
			setCustomMuscles(
				data.muscles_targeted.filter(
					x => !MUSCLES_TARGETED.includes(x)
				)
			);
		
			setShowEquipment(
				data.equipment.some(
					x => !EQUIPMENT_OPTIONS.includes(x)
				)
			);
		
			setShowMuscle(
				data.muscles_targeted.some(
					x => !MUSCLES_TARGETED.includes(x)
				)
			);
		} else {
			reset({
				name: "",
				category: "",
				level: "",
				video_url: "",
				instructions: "",
				equipment: [],
				muscles_targeted: [],
				demo_images: []
			});

			setVideoInput("");
			setExistingImages([]);
			setFiles([]);
			setCustomCategory(false);

			setCustomEquipments([]);
			setCustomMuscles([]);

			setShowEquipment(false);
			setShowMuscle(false);
		}
	}, [initial, open, reset]);

	const toggleArray = (field: "equipment" | "muscles_targeted", value: string) => {
		const current = field === "equipment"
			? equipment
			: muscles;
		
		const updated = current.includes(value)
			? current.filter(x => x !== value)
			: [...current, value];

		setValue(field, updated, { shouldDirty: true });
	};

	const addCustom = ( field: "equipment" | "muscles_targeted" ) => {
		const value = field === "equipment"
			? customEquipment.trim()
			: customMuscle.trim();
	
		if (!value) return;
	
		if (field === "equipment") {
			if (!equipment.includes(value)) {
				setValue("equipment", [...equipment, value], {
					shouldDirty: true
				});
	
				setCustomEquipments(prev => [
					...prev,
					value
				]);
			}
	
			setCustomEquipment("");
		}
		else {
			if (!muscles.includes(value)) {
				setValue("muscles_targeted", [...muscles, value],
					{
						shouldDirty:true
					}
				);
	
				setCustomMuscles(prev => [...prev, value]);
	
			}
	
			setCustomMuscle("");
		}
	
	};

	const removeCustomEquipment = (value:string)=>{

		setCustomEquipments(prev =>
			prev.filter(x => x !== value)
		);
	
		setValue(
			"equipment",
			equipment.filter(x => x !== value),
			{
				shouldDirty:true
			}
		);
	
	};
	
	const removeCustomMuscle = (value:string)=>{
	
		setCustomMuscles(prev =>
			prev.filter(x => x !== value)
		);
	
		setValue(
			"muscles_targeted",
			muscles.filter(x => x !== value),
			{
				shouldDirty:true
			}
		);
	
	};

	const handleFiles = (list: FileList | null) => {
		if (!list) return;

		setFiles(prev => [ ...prev, ...Array.from(list)]);
	};

	const removeFile = (index: number) => setFiles(prev => prev.filter((_, i) => i !== index));

	const submit = (data: WorkoutForm) => {
		const formData = new FormData();

		if (initial) {

			if (dirtyFields.name)
				formData.append("name", data.name);

			if (dirtyFields.category)
				formData.append("category", data.category);

			if (dirtyFields.level)
				formData.append("level", data.level);

			if (dirtyFields.video_url)
				formData.append("video_url", data.video_url);

			if (dirtyFields.instructions)
				formData.append("instructions", data.instructions);

			if (dirtyFields.equipment)
				data.equipment.forEach(x =>
					formData.append("equipment", x)
				);

			if (dirtyFields.muscles_targeted)
				data.muscles_targeted.forEach(x =>
					formData.append("muscles_targeted", x)
				);
			
			files.forEach(file =>
				formData.append("demo_images", file)
			);

			updateTutorial(
				{
					id: initial.id,
					data: formData
				},
				{
					onSuccess() {
						toast.success("Tutorial updated successfully!");
						onClose();
					}
				}
			);

			return;
		}

		formData.append("name", data.name);
		formData.append("category", data.category);
		formData.append("level", data.level);
		formData.append("video_url", data.video_url);
		formData.append("instructions", data.instructions);

		data.equipment.forEach(x =>
			formData.append("equipment[]", x)
		);

		data.muscles_targeted.forEach(x =>
			formData.append("muscles_targeted[]", x)
		);

		files.forEach(file =>
			formData.append("demo_images", file)
		);
		
		createTutorial(formData, {
			onSuccess() {
				toast.success("Tutorial created successfully!");
				onClose();
			}
		});
	};

	const thumb = videoId ? ytThumb(videoId) : null;
	
	return (
		<Dialog open={open} onOpenChange={onClose}>
			<DialogContent
				className="
					p-0
					sm:max-w-xl
					h-[70vh]
					overflow-hidden
					rounded-2xl
					bg-white
					dark:bg-stone-900
					border-stone-200
					dark:border-stone-700
				"
			>
				<DialogHeader
					className="
					px-6
					py-4
					border-b
					border-stone-200
					dark:border-stone-700
					"
				>
					<DialogTitle
					className="
						text-xl
						font-semibold
						text-slate-800
						dark:text-slate-100
					"
					>
					{initial ? "Update Tutorial" : "Add Tutorial"}
					</DialogTitle>

					<p className="
					text-xs
					text-slate-400
					dark:text-slate-500
					">
						Fill in workout information
					</p>
				</DialogHeader>

				<ScrollArea className="flex-1 overflow-y-auto">
					<form
						onSubmit={handleSubmit(submit)}
						className="px-6 py-5 space-y-6"
					>
						{/* BASIC INFORMATION */}
						<section className="space-y-4">
							<p className="
								text-xs
								font-semibold
								uppercase
								tracking-wide
								text-slate-400
								dark:text-slate-500
							">
								Basic Information
							</p>

							<div className="space-y-1.5">
								<label className="
								text-sm
								font-medium
								text-slate-700
								dark:text-slate-200
								">
								Workout Name
								</label>

								<Input
								placeholder="Workout name..."
								{...register("name")}
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

							<div className="grid grid-cols-2 gap-3">

								{/* CATEGORY */}
								<div className="space-y-1.5">
								<label className="
									text-sm
									font-medium
									text-slate-700
									dark:text-slate-200
								">
									Category
								</label>

								<Select
									value={customCategory ? "Custom" : category}
									onValueChange={(value) => {
										if (value === "Custom") {
										setCustomCategory(true);

										setValue("category", "", {
											shouldDirty: true
										});
										} else {
										setCustomCategory(false);

										setValue("category", value, {
											shouldDirty: true
										});
										}
									}}
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
										<SelectValue placeholder="Category" />
									</SelectTrigger>

									<SelectContent
										className="
										bg-white
										dark:bg-stone-900
										border-slate-200
										dark:border-stone-700
										"
									>
										{CATEGORIES.map((x) => (
										<SelectItem
											key={x}
											value={x}
										>
											{x}
										</SelectItem>
										))}

										<SelectItem value="Custom">
										+ Custom
										</SelectItem>
									</SelectContent>
								</Select>

								{customCategory && (
									<Input
										placeholder="Custom category..."
										value={category}
										onChange={(e) =>
										setValue(
											"category",
											e.target.value,
											{
												shouldDirty: true
											}
										)
										}
										className="
										h-11
										mt-2
										bg-white
										dark:bg-stone-800
										border-slate-200
										dark:border-stone-700
										"
									/>
								)}
								</div>


								{/* LEVEL */}
								<div className="space-y-1.5">
								<label className="
									text-sm
									font-medium
									text-slate-700
									dark:text-slate-200
								">
									Level
								</label>

								<Select
									value={watch("level")}
									onValueChange={(value) =>
										setValue(
										"level",
										value as
											| "Beginner"
											| "Intermediate"
											| "Advanced"
											| "",
										{
											shouldDirty: true
										}
										)
									}
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
										<SelectValue placeholder="Level" />
									</SelectTrigger>

									<SelectContent
										className="
										bg-white
										dark:bg-stone-900
										border-slate-200
										dark:border-stone-700
										"
									>
										{LEVELS.map((x) => (
										<SelectItem
											key={x}
											value={x}
										>
											{x}
										</SelectItem>
										))}
									</SelectContent>
								</Select>
								</div>

							</div>
						</section>

						{/* YOUTUBE VIDEO */}
						<section className="space-y-3">
							<p className="
								text-xs
								font-semibold
								uppercase
								tracking-wide
								text-slate-400
								dark:text-slate-500
							">
								YouTube Video
							</p>

							<Input
								placeholder="Video URL..."
								value={videoInput}
								onChange={(e) => {
								setVideoInput(e.target.value);

								setValue(
									"video_url",
									e.target.value,
									{
										shouldDirty: true
									}
								);
								}}
								className="
								h-11
								bg-white
								dark:bg-stone-800
								border-slate-200
								dark:border-stone-700
								"
							/>

							{thumb && (
								<img
								src={thumb}
								className="
									h-32
									w-full
									rounded-xl
									object-cover
									border
									border-slate-200
									dark:border-stone-700
								"
								/>
							)}
						</section>
						
						{/* INSTRUCTIONS */}
						<section className="space-y-3">
							<p className="
								text-xs
								font-semibold
								uppercase
								tracking-wide
								text-slate-400
								dark:text-slate-500
							">
								Instructions
							</p>

							<Textarea
								rows={5}
								placeholder="Workout instructions..."
								{...register("instructions")}
								className="
								bg-white
								dark:bg-stone-800
								border-slate-200
								dark:border-stone-700
								text-slate-700
								dark:text-slate-200
								h-30
								"
							/>
						</section>

						{/* EQUIPMENT */}
						<section className="space-y-3">
							<p className="
								text-xs
								font-semibold
								uppercase
								tracking-wide
								text-slate-400
								dark:text-slate-500
							">
								Equipment
							</p>

							<div className="flex flex-wrap gap-2">

								{EQUIPMENT_OPTIONS.map((x) => (
								<button
									key={x}
									type="button"
									onClick={() =>
										toggleArray("equipment", x)
									}
									className={`
										px-3
										py-1.5
										rounded-full
										text-xs
										border
										transition

										${
										equipment.includes(x)
											? "bg-amber-500 text-white border-amber-500"
											: `
												bg-white
												dark:bg-stone-800
												text-slate-600
												dark:text-slate-300
												border-slate-200
												dark:border-stone-700
												hover:bg-slate-100
												dark:hover:bg-stone-700
											`
										}
									`}
								>
									{x}
								</button>
								))}


								<button
								type="button"
								onClick={() => setShowEquipment(!showEquipment)}
								className="
									px-3
									py-1.5
									rounded-full
									text-xs
									border
									border-dashed
									flex
									items-center
									gap-1
									text-slate-600
									dark:text-slate-300
								"
								>
								<Plus size={14} />
								Custom
								</button>

							</div>


							{showEquipment && (
								<div className="space-y-3">

								<div className="flex flex-wrap gap-2">

									{customEquipments.map((item) => (
										<div
										key={item}
										className="
											flex
											items-center
											gap-1
											px-3
											py-1
											rounded-full
											bg-slate-100
											dark:bg-stone-800
											text-xs
											text-slate-700
											dark:text-slate-300
										"
										>
										{item}

										<button
											type="button"
											onClick={() =>
												removeCustomEquipment(item)
											}
										>
											<X size={13} />
										</button>
										</div>
									))}

								</div>


								<div className="flex gap-2">

									<Input
										placeholder="Equipment name..."
										value={customEquipment}
										onChange={(e) =>
										setCustomEquipment(e.target.value)
										}
										className="
										h-10
										bg-white
										dark:bg-stone-800
										border-slate-200
										dark:border-stone-700
										"
									/>

									<Button
										type="button"
										size="icon"
										onClick={() =>
										addCustom("equipment")
										}
										className="
										bg-emerald-500
										hover:bg-emerald-600
										"
									>
										<Plus size={16} />
									</Button>

								</div>

								</div>
							)}

						</section>
						
						{/* MUSCLES TARGETED */}
						<section className="space-y-3">
							<p className="
								text-xs
								font-semibold
								uppercase
								tracking-wide
								text-slate-400
								dark:text-slate-500
							">
								Muscles Targeted
							</p>

							<div className="flex flex-wrap gap-2">

								{MUSCLES_TARGETED.map((x) => (
								<button
									key={x}
									type="button"
									onClick={() =>
										toggleArray("muscles_targeted", x)
									}
									className={`
										px-3
										py-1.5
										rounded-full
										text-xs
										border
										transition

										${
										muscles.includes(x)
											? "bg-indigo-500 text-white border-indigo-500"
											: `
												bg-white
												dark:bg-stone-800
												text-slate-600
												dark:text-slate-300
												border-slate-200
												dark:border-stone-700
												hover:bg-slate-100
												dark:hover:bg-stone-700
											`
										}
									`}
								>
									{x}
								</button>
								))}


								<button
								type="button"
								onClick={() => setShowMuscle(!showMuscle)}
								className="
									px-3
									py-1.5
									rounded-full
									text-xs
									border
									border-dashed
									flex
									items-center
									gap-1
									text-slate-600
									dark:text-slate-300
								"
								>
								<Plus size={14} />
								Custom
								</button>

							</div>


							{showMuscle && (
								<div className="space-y-3">

								<div className="flex flex-wrap gap-2">

									{customMuscles.map((item) => (
										<div
										key={item}
										className="
											flex
											items-center
											gap-1
											px-3
											py-1
											rounded-full
											bg-slate-100
											dark:bg-stone-800
											text-xs
											text-slate-700
											dark:text-slate-300
										"
										>
										{item}

										<button
											type="button"
											onClick={() =>
												removeCustomMuscle(item)
											}
										>
											<X size={13} />
										</button>
										</div>
									))}

								</div>


								<div className="flex gap-2">

									<Input
										placeholder="Muscle name..."
										value={customMuscle}
										onChange={(e) =>
										setCustomMuscle(e.target.value)
										}
										className="
										h-10
										bg-white
										dark:bg-stone-800
										border-slate-200
										dark:border-stone-700
										"
									/>

									<Button
										type="button"
										size="icon"
										onClick={() =>
										addCustom("muscles_targeted")
										}
										className="
										bg-emerald-500
										hover:bg-emerald-600
										"
									>
										<Plus size={16} />
									</Button>

								</div>

								</div>
							)}

						</section>

						{/* DEMONSTRATION IMAGES */}
						<section className="space-y-3">
							<p className="
								text-xs
								font-semibold
								uppercase
								tracking-wide
								text-slate-400
								dark:text-slate-500
							">
								Demonstration Images
							</p>


							<div className="flex flex-wrap gap-2">

								{existingImages.map((src, i) => (
								<div
									key={i}
									className="
										relative
										w-20
										h-20
										rounded-xl
										overflow-hidden
										border
										border-slate-200
										dark:border-stone-700
									"
								>
									<img
										src={src}
										className="
										w-full
										h-full
										object-cover
										"
									/>

									<button
										type="button"
										onClick={() =>
										setExistingImages((prev) =>
											prev.filter(
												(_, index) => index !== i
											)
										)
										}
										className="
										absolute
										top-1
										right-1
										bg-black/50
										text-white
										rounded-full
										"
									>
										<X size={14} />
									</button>

								</div>
								))}


								{files.map((file, i) => (
								<div
									key={i}
									className="
										relative
										w-20
										h-20
										rounded-xl
										overflow-hidden
										border
									"
								>
									<img
										src={URL.createObjectURL(file)}
										className="
										w-full
										h-full
										object-cover
										"
									/>

									<button
										type="button"
										onClick={() =>
										removeFile(i)
										}
										className="
										absolute
										top-1
										right-1
										bg-black/50
										text-white
										rounded-full
										"
									>
										<X size={14} />
									</button>

								</div>
								))}


								<button
								type="button"
								onClick={() =>
									fileRef.current?.click()
								}
								className="
									w-20
									h-20
									border-2
									border-dashed
									rounded-xl
									flex
									flex-col
									items-center
									justify-center
									text-xs
									text-slate-500
									dark:text-slate-400
								"
								>
								<ImageIcon size={16} />
								Add
								</button>


								<input
								ref={fileRef}
								type="file"
								hidden
								multiple
								accept="image/*"
								onChange={(e) =>
									handleFiles(e.target.files)
								}
								/>

							</div>

						</section>
					</form>
				</ScrollArea>

				{/* ACTIONS */}
				<div className="
					px-6
					py-4
					border-t
					border-stone-200
					dark:border-stone-700
					flex
					gap-3
				">

					<Button
						variant="outline"
						className="
							flex-1
							h-11
							border-slate-200
							dark:border-stone-700
							dark:text-slate-200
							dark:hover:bg-stone-800
						"
						onClick={onClose}
					>
						Cancel
					</Button>

					<Button
						className="
							flex-1
							h-11
							bg-emerald-500
							hover:bg-emerald-600
							text-white
						"
						disabled={isPending}
						onClick={handleSubmit(submit)}
					>
					{isPending
						? "Saving..."
						: initial
						? "Update"
						: "Save"
					}

					</Button>

				</div>

			</DialogContent>
		</Dialog>
	);
};