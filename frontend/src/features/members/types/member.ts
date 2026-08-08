export interface Member {
  id?: number;
  fullname: string;
  email: string;
  age: number;
  gender: "Male" | "Female";
  plan_id: number;
  referral_code: string;
  membership_plans: {
    plan_name: string,
    duration: number,
    duration_type: string
  };
  status?: string
  join_date?: string
  points?: number
}
 
export type MemberFilters = {
  search?: string;
  gender?: string;
  status?: string;
};

export type RenewMembershipDTO = {
  member_id: number;
	plan_id: number;
	payment_method: "GCash" | "Cash" | "Bank_Transfer";
};
