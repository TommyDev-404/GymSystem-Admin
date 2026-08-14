import { api } from "@/lib/axios";
import type { AddMemberFormType, MemberFilters, RenewMembershipDTO, UpgradeMembership } from "../types/member";

export const getMembersSummaryApi = async () => {
  try {
    const res = await api.get("/members/summary");

    return res.data;
  } catch (error) {
    console.error("Get members failed:", error);
    throw error;
  }
};

export const getMembersApi = async (
  params?: MemberFilters
) => {
  try {
    const res = await api.get("/members", { params });

    return res.data;
  } catch (error) {
    console.error("Get members failed:", error);
    throw error;
  }
};

export const createMemberApi = async (data: AddMemberFormType) => {
  try {
    const res = await api.post("/members/add", data);
    return res.data;
  } catch (error) {
    console.error("Create member failed:", error);
    throw error;
  }
};

export const upgradeMembershipPlanApi = async (id: number, data: UpgradeMembership) => {
  console.log(data);
  try {
    const res = await api.patch(`/members/changed-membership-plan/${id}`, { data });
    return res.data;
  } catch (error) {
    console.error("Update member failed:", error);
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