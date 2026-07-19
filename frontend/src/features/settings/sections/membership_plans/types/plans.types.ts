export type Plan = {
  id: number;
  plan_name: string;
  price: number;
  duration: number;
  duration_type: "Day" | "Week" | "Month" | "Year";
  created_at?: string;
  updated_at?: string;
};

export type CreatePlanDTO = {
  plan_name: string;
  price: number;
  duration: number;
  duration_type: "Day" | "Week" | "Month" | "Year";
};

export interface UpdatePlanDTO {
  id: number;
  data: {
    plan_name?: string;
    price?: number;
    duration?: number;
    duration_type?: "Day" | "Week" | "Month" | "Year";
  };
}