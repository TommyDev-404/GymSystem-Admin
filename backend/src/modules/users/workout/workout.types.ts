
export type  ExerciseInput = {
   name: string;
   sets?: number;
   reps?: number;
   weight?: number;
 }

export type CreateWorkoutInput = {
   member_id: number;
   name: string;
   duration: string;
   exercises: ExerciseInput[];
 }