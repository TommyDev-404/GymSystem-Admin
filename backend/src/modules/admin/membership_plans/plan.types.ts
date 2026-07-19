export interface CreatePlanDTO {
   plan_name: string;
   price: number;
   duration: number;
   duration_type:  "Week" | "Month";
 }
 
 export interface UpdatePlanDTO {
  id: number;
  data: {
    plan_name?: string;
    price?: number;
    duration?: number;
    duration_type?:  "Week" | "Month";
  };
}