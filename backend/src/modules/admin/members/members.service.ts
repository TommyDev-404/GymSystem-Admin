import * as repo from "./members.repository";
import { CreateMemberDTO } from "./members.types";

/* ---------------- TYPES ---------------- */
export type MemberFilters = {
  search?: string;
  gender?: "Male" | "Female";
  status?: "Active" | "Inactive" | "Suspended";
};

/* ---------------- CREATE MEMBER ---------------- */

export const createMember = async (data: CreateMemberDTO) => {
  try {
    return await repo.createMember(data);
  } catch (error) {
    throw new Error("Failed to create member");
  }
};

/* ---------------- UPDATE MEMBER ---------------- */

export const updateMember = async (
  id: number,
  data: Partial<CreateMemberDTO>
) => {
  try {
    const member = await repo.findMemberById(id);
    if (!member) throw new Error("Member not found");

    return await repo.updateMember(id, data);
  } catch (error) {
    throw new Error("Failed to update member");
  }
};

/* ---------------- DELETE MEMBER ---------------- */

export const deleteMember = async (id: number) => {
  try {
    const member = await repo.findMemberById(id);
    if (!member) throw new Error("Member not found");

    return await repo.deleteMember(id);
  } catch (error) {
    throw new Error("Failed to delete member");
  }
};

/* ---------------- GET MEMBERS (FILTERED) ---------------- */

export const getMembers = async (filters: MemberFilters) => {
  try {
    return await repo.getMembers(filters);
  } catch (error) {
    throw new Error("Failed to fetch members");
  }
};

/* ---------------- GET MEMBER BY ID ---------------- */

export const getMemberById = async (id: number) => {
  try {
    const member = await repo.findMemberById(id);
    if (!member) throw new Error("Member not found");

    return member;
  } catch (error) {
    throw new Error("Failed to fetch member");
  }
};

export const resendActivationCode = async (email: string) => {
  try {
    return await repo.resendActivationCode(email);
  } catch (error) {
    throw new Error("Failed to resend activation code");
  }
};