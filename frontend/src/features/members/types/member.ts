export interface Member {
  id?: number;
  fullname: string;
  age: number;
  email: string;
  gender: "Male" | "Female";
  membership_id: number;
  plan_id: number;
  plan_name: string;
  plan_price: number;
  membership_start: Date;
  membership_end: Date;
  duration_type: string;
  duration: number;
  status?: string;
  points?: number;
}

export type MemberSummaryType = {
  active: number;
  activeMale: number;
  activeFemale: number;

  expiringSoon: number;
  expiringTomorrow: number;
  expiringWithin3Days: number;
  expiringWithin7Days: number;

  expired: number;
  expiredMale: number;
  expiredFemale: number;
};
 
export type AddMemberFormType = {
  fullname: string;
  email: string;
  age: number;
  gender: string;
  plan_id: number;
  membership_id: number;
  referral_code: string;
  payment_method: "Cash" | "GCash" | undefined
};

export type UpgradeMembership = {
  plan_id: number,
  membership_id: number,
  payment_method: string,
  amount: number
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

export type MemberPlan = {
  id: number;
  plan_name: string;
  duration: number;
  duration_type: string;
  price: number
};