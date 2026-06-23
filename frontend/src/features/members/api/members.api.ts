import { api } from "@/lib/axios";

/* ---------------- TYPES ---------------- */

export type Member = {
  id: number;
  fullname: string;
  age: number;
  gender: "Male" | "Female";
  plan_id: number;
};

/* ---------------- CREATE MEMBER ---------------- */

export const createMemberApi = async (data: Omit<Member, "id">) => { // remove the id
  const res = await api.post("/members/add", data);
  return res.data;
};

/* ---------------- UPDATE MEMBER ---------------- */

export const updateMemberApi = async (
  id: number,
  data: Partial<Member>
) => {
  const res = await api.put(
    `/members/update/${id}`,
    data
  );

  return res.data;
};

/* ---------------- DELETE MEMBER ---------------- */

export const deleteMemberApi = async (id: number) => {
  const res = await api.delete(
    `/members/delete/${id}`
  );

  return res.data;
};

/* ---------------- GET ALL MEMBERS ---------------- */
type MemberFilters = {
  search?: string;
  gender?: string;
  status?: string;
};

export const getMembersApi = async (params?: MemberFilters) => {
  const res = await api.get("/members", {
    params,
  });

  return res.data;
};

/* ---------------- GET MEMBER BY ID ---------------- */

export const getMemberByIdApi = async (id: number) => {
  const res = await api.get(`/members/${id}`);
  return res.data;
};


export const resendActivationCodeApi = async (email: string) => {
  const res = await api.post(`/members/resend`, { email: email });

  return res.data;
};