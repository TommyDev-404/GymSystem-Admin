
// ==================== CREATE MEMBER ====================
export type CreateMemberDTO = {
  fullname: string;
  age: number;
  email: string;
  gender?: "Male" | "Female";
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

export type MemberQueryDTO = {
  status?: "Active" | "Inactive" | "Suspended";
  gender?: "Male" | "Female";
  search?: string;
};