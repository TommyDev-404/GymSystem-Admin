import { api } from "@/lib/axios";
import type { Member, MemberFilters, RenewMembershipDTO } from "../types/member";

export const createMemberApi = async (data: Omit<Member, "id">) => {
  try {
    const res = await api.post("/members/add", data);
    return res.data;
  } catch (error) {
    console.error("Create member failed:", error);
    throw error;
  }
};

export const updateMemberApi = async (id: number, data: Partial<Member>) => {
  try {
    const res = await api.patch(`/members/update/${id}`, data);
    return res.data;
  } catch (error) {
    console.error("Update member failed:", error);
    throw error;
  }
};

export const updateMemberStatusApi = async (id: number, data: { status: string }) => {
  try {
    const res = await api.patch(
      `/members/update-status/${id}`,
      data
    );

    return res.data;
  } catch (error) {
    console.error("Update member status failed:", error);
    throw error;
  }
};

export const deleteMemberApi = async (id: number) => {
  try {
    const res = await api.delete(`/members/delete/${id}`);
    return res.data;
  } catch (error) {
    console.error("Delete member failed:", error);
    throw error;
  }
};

export const getMembersApi = async (
  params?: MemberFilters
) => {
  try {
    const res = await api.get("/members", {
      params,
    });

    return res.data;
  } catch (error) {
    console.error("Get members failed:", error);
    throw error;
  }
};

export const getMemberByIdApi = async (id: number) => {
  try {
    const res = await api.get(`/members/${id}`);
    return res.data;
  } catch (error) {
    console.error("Get member by ID failed:", error);
    throw error;
  }
};

export const resendActivationCodeApi = async (
  email: string
) => {
  try {
    const res = await api.post("/members/resend", {
      email,
    });

    return res.data;
  } catch (error) {
    console.error(
      "Resend activation code failed:",
      error
    );
    throw error;
  }
};

export const renewMembershipApi = async (data: RenewMembershipDTO) => {
  try {
    const res = await api.post("/members/renew-membership", data);
    return res.data;
  } catch (error) {
    console.error("Renew membership failed:", error);
    throw error;
  }
};