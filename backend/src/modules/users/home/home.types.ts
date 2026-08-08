
export type CreateGoalDTO = {
   member_id:number;
   goal_type:"LOSE_WEIGHT" | "GAIN_WEIGHT";
   current_weight:number;
   target_weight:number;
}
 
export type UpdateGoalDTO = {
   goal_type?:
   "LOSE_WEIGHT" |
   "GAIN_WEIGHT";
   current_weight?:number;
   target_weight?:number;
 }
 