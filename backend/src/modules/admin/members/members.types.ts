
// ==================== CREATE MEMBER ====================
export type CreateMemberDTO = {
  fullname: string;
  age: number;
  email: string;
  gender: "Male" | "Female";
  referral_code?: string;
  plan_id: number;
  membership_id?: number
  payment_method: "Cash" | "GCash" 
  join_date: string;
};

// ==================== UPDATE MEMBER ====================

export type UpdateMemberDTO = {
  fullname?: string;
  age?: number;
  gender?: "Male" | "Female";
  plan?: string;
  status?: "Active" | "Expired" | "Cancelled";
};

// ==================== QUERY / FILTER ====================
export interface MemberFilters {
  search?: string;
  engagementStatus?: string;
  membershipStatus?: string;
}

export type PaymentHistoryFilters = {
	month?: number;
	year?: number;
 };