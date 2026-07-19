
export type Workout = {
   id: number
   name: string;
   category: string;
   level: "Beginner" | "Intermediate" | "Advanced" | "";
   video_url: string,
   instructions: string;
   equipment: string[];
   muscles_targeted: string[];
   demo_images: string[];
   created_at?:Date;
}
 
export type WorkoutResponse = Omit<Workout, 
  "equipment" | 
  "muscles_targeted" | 
  "demo_images"
> & {
  equipment: string;
  muscles_targeted: string;
  demo_images: string;
};

export type WorkoutForm = Omit<Workout, "id" | "demo_images"> & {
   demo_images: File[];
};
 
export type TutorialsFilters = {
  search?: string | undefined;
  level?: string | undefined;
}