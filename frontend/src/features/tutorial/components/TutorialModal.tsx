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
import { ImageIcon, Loader2, Plus, X } from "lucide-react";

import { useCreateTutorial, useUpdateTutorial } from "../hook/useTutorial";

import type {
	Workout,
	WorkoutForm,
} from "../types/TutorialType";
import { toast } from "sonner";
import { parseYouTubeId, ytThumb } from "@/utils/ytParser";
import { CATEGORIES, EQUIPMENT_OPTIONS, LEVELS, MUSCLES_TARGETED } from "../constants/TutorialConstants";

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

		console.log("Data: ", formData);
		
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
			<DialogContent className="p-0 sm:max-w-xl h-[70vh] overflow-hidden rounded-2xl">
	
				<DialogHeader className="px-6 py-4 border-b">
					<DialogTitle>
						{initial ? "Update Workout" : "Add Workout"}
					</DialogTitle>
	
					<p className="text-xs text-slate-400">
						Fill in workout information
					</p>
				</DialogHeader>
	
				<ScrollArea className="flex-1 overflow-y-auto">
					<form
						onSubmit={handleSubmit(submit)}
						className="px-6 py-5 space-y-6"
					>
						{/* BASIC INFO */}
						<section className="space-y-3">
							<p className="text-sm font-medium">Basic Info</p>
	
							<Input
								placeholder="Workout name..."
								{...register("name")}
							/>
	
							<div className="grid grid-cols-2 gap-3">
								<div className="space-y-2">
									<select
										className="w-full border rounded-xl px-3 py-2.5 text-sm"
										value={customCategory ? "Custom": category}
										onChange={(e) => {
											if (e.target.value === "Custom") {
												setCustomCategory(true);

												setValue("category", "", {
													shouldDirty:true
												});
											} else {
												setCustomCategory(false);

												setValue("category", e.target.value, {
													shouldDirty:true
												});
											}
										}}
									>
										<option disabled hidden value="">Category</option>

										{CATEGORIES.map(x => (
											<option key={x} value={x}> {x}</option>
										))}

										<option value="Custom">+ Custom</option>
									</select>
	
									{customCategory && (
										<Input
											placeholder="Custom category..."
											value={category}
											onChange={(e) =>
												setValue("category", e.target.value,{
													shouldDirty: true
												})
											}
										/>
									)}
								</div>
								
								<select
									className="w-full border rounded-xl px-3 py-2.5 text-sm h-fit"
									value={watch("level")}
									onChange={(e) => {
										setValue("level", e.target.value as  "Beginner" | "Intermediate" | "Advanced" | "", {
											shouldDirty: true
										});
									}}
								>
									<option disabled hidden value="">
										Level
									</option>

									{LEVELS.map(x => (
										<option key={x} value={x}>
											{x}
										</option>
									))}
								</select>
							</div>
						</section>
	
						{/* VIDEO */}
						<section className="space-y-2">
							<p className="text-sm font-medium">YouTube Video</p>
	
							<Input
								placeholder="Video URL..."
								value={videoInput}
								onChange={(e) => {
									setVideoInput(e.target.value);
	
									setValue("video_url", e.target.value,{
										shouldDirty: true
									});
								}}
							/>
	
							{thumb && (
								<img
									src={thumb}
									className="h-32 w-full rounded-xl object-cover border"
								/>
							)}
						</section>
	
						{/* INSTRUCTIONS */}
						<section className="space-y-2">
							<p className="text-sm font-medium">Instructions</p>
	
							<Textarea
								rows={5}
								placeholder="Workout instructions..."
								{...register("instructions")}
							/>
						</section>
	
						{/* EQUIPMENT */}
						<section className="space-y-2">
							<p className="text-sm font-medium">Equipment</p>
	
							<div className="flex flex-wrap gap-2">
								{EQUIPMENT_OPTIONS.map(x => (
									<button
										key={x}
										type="button"
										onClick={() =>
											toggleArray("equipment", x)
										}
										className={`
											px-3 py-1.5 rounded-full text-xs border
											${equipment.includes(x)
												? "bg-amber-500 text-white"
												: "hover:bg-slate-100"
											}
										`}
									>
										{x}
									</button>
								))}
	
								<button
									type="button"
									onClick={() => setShowEquipment(!showEquipment)}
									className="px-3 py-1.5 rounded-full text-xs border border-dashed flex items-center gap-1"
								>
									<Plus size={14} />
									Custom
								</button>
	
							</div>
	
							{showEquipment && (
								<div className="space-y-3">
									<div className="flex flex-wrap gap-2">
										{customEquipments.map(item => (
											<div
												key={item}
												className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-xs"
											>
												{item}

												<button
													type="button"
													onClick={()=>removeCustomEquipment(item)}
												>
													<X size={13}/>
												</button>
											</div>
										))}
									</div>

									<div className="flex gap-2">

									<Input
										placeholder="Equipment name..."
										value={customEquipment}
										onChange={(e)=>
											setCustomEquipment(e.target.value)
										}
									/>

									<Button
										type="button"
										size="icon"
										onClick={()=>addCustom("equipment")}
									>
										<Plus size={16}/>
									</Button>

									</div>
								</div>

							)}
						</section>
	
						{/* MUSCLES */}
						<section className="space-y-2">
							<p className="text-sm font-medium"> Muscles Targeted</p>
	
							<div className="flex flex-wrap gap-2">
								{MUSCLES_TARGETED.map(x => (
									<button
										key={x}
										type="button"
										onClick={() =>
											toggleArray("muscles_targeted", x)
										}
										className={`
											px-3 py-1.5 rounded-full text-xs border
											${muscles.includes(x)
												? "bg-indigo-500 text-white"
												: "hover:bg-slate-100"
											}
										`}
									>
										{x}
									</button>
								))}
	
								<button
									type="button"
									onClick={() => setShowMuscle(!showMuscle)}
									className="px-3 py-1.5 rounded-full text-xs border border-dashed flex items-center gap-1"
								>
									<Plus size={14} />
									Custom
								</button>
	
							</div>
	
							{showMuscle && (
								<div className="space-y-3">
									<div className="flex flex-wrap gap-2">
										{customMuscles.map(item => (
											<div
												key={item}
												className="flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-xs"
											>	
												{item}

												<button
													type="button"
													onClick={()=>removeCustomMuscle(item)}
												>
													<X size={13}/>
												</button>
											</div>
										))}
									</div>

									<div className="flex gap-2">

										<Input
											placeholder="Muscle name..."
											value={customMuscle}
											onChange={(e)=>
												setCustomMuscle(e.target.value)
											}
										/>

										<Button
											type="button"
											size="icon"
											onClick={()=>addCustom("muscles_targeted")}
										>
											<Plus size={16}/>
										</Button>

									</div>
								</div>

							)}
						</section>
	
						{/* IMAGES */}
						<section className="space-y-2">
							<p className="text-sm font-medium">Demonstration Images</p>
	
							<div className="flex flex-wrap gap-2">
								{existingImages.map((src, i) => (
									<div
										key={i}
										className="relative w-20 h-20 rounded-xl overflow-hidden border"
									>
										<img
											src={src}
											className="w-full h-full object-cover"
										/>
	
										<button
											type="button"
											onClick={() =>
												setExistingImages(
													prev => prev.filter(
														(_, index) => index !== i
													)
												)
											}
											className="absolute top-1 right-1 bg-black/50 text-white rounded-full"
										>
											<X size={14} />
										</button>
	
									</div>
								))}
	
								{files.map((file, i) => (
									<div
										key={i}
										className="relative w-20 h-20 rounded-xl overflow-hidden border"
									>
										<img
											src={URL.createObjectURL(file)}
											className="w-full h-full object-cover"
										/>
	
										<button
											type="button"
											onClick={() =>
												removeFile(i)
											}
											className="absolute top-1 right-1 bg-black/50 text-white rounded-full"
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
									className="w-20 h-20 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-xs"
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
	
				<div className="px-6 py-4 border-t flex gap-3">
					<Button
						variant="outline"
						className="flex-1"
						onClick={onClose}
					>
						Cancel
					</Button>
	
					<Button
						className="flex-1 bg-emerald-500 hover:bg-emerald-600"
						disabled={isPending}
						onClick={handleSubmit(submit)}
					>
	
						{isPending && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
	
						{isPending
							? "Saving..."
							: initial
								? "Update Workout"
								: "Save Workout"
						}
	
					</Button>
	
				</div>

			</DialogContent>
		</Dialog>
	);
};