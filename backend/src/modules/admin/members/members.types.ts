
// ==================== CREATE MEMBER ====================
export type CreateMemberDTO = {
  fullname: string;
  age: number;
  email: string;
  gender: "Male" | "Female";
  referral_code?: string;
  plan_id: number;
  join_date: string;
};

// ==================== UPDATE MEMBER ====================

export type UpdateMemberDTO = {
  fullname?: string;
  age?: number;
  gender?: "Male" | "Female";
  plan?: string;
  status?: "Active" | "Inactive" | "Suspended";
};

// ==================== QUERY / FILTER ====================
export type MemberFilters = {
  search?: string;
  gender?: "Male" | "Female";
  status?: "Active" | "Inactive" | "Suspended";
};