export interface Member {
  id: number;
  fullname: string;
  email: string;
  membership_id: number;
  plan_id: number;
  plan_name: string;
  plan_price: number;
  membership_start: Date;
  membership_end: Date;
  duration_type: string;
  duration: number;
  daily_hours_limit: number;
  engagement_status: string;
  status?: string;
  points?: number;
}

export type MemberSummaryType = {
  active: number;
  expiringTomorrow: number;
  expired: number;
  inactiveMembers: number;
};

export type AddMemberFormType = {
  fullname: string;
  email: string;
  age: number;
  gender: string;
  plan_id: number;
  membership_id?: number;
  referral_code: string;
  payment_method: "Cash" | "GCash" | undefined
};

export type UpgradeMembership = {
  plan_id: number,
  membership_id: number,
  payment_method: string,
  amount: number
}

export interface MemberFilters {
  search?: string;
  engagementStatus?: string;
  membershipStatus?: string;
}

export type RenewMembershipDTO = {
  member_id: number;
	plan_id: number;
	payment_method: "GCash" | "Cash" | "Bank_Transfer";
};

export type MemberPlan = {
  id: number;
  plan_name: string;
  duration: number;
  daily_hours_limit: number;
  duration_type: string;
  price: number
};

export type PaymentHistoryFilters = {
	month?: number;
	year?: number;
 };