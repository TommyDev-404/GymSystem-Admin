
export type WorkoutType = {
   name: string,
   category: string,
   level: "Beginner" | 'Intermediate' | 'Advanced';
   video_url: string,
   instructions: string,
   equipment: string[],
   muscles_targeted: string[],
   demo_images?: string[],
};

export type WorkoutFilters = {
   search?: string | undefined;
   level?: "Beginner" | 'Intermediate' | 'Advanced' | undefined;
   category?: string | undefined;
};