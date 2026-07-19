
export type  ExerciseInput = {
   name: string;
   sets: string | number;
   reps: string | number;
   weight: string | number;
 }

export type CreateWorkoutInput = {
   member_id: number;
   name: string;
   duration: string;
   calories: string;
   exercises: ExerciseInput[];
 }