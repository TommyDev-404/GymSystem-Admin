export interface Member {
  id?: number;
  fullname: string;
  email: string;
  age: number;
  gender: "Male" | "Female";
  plan_id: number;
  membership_plans: {
    plan_name: string
  };
  status?: string
  join_date?: string
 }