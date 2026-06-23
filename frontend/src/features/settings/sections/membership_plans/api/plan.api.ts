import { api } from "@/lib/axios";

/* ---------------- TYPES ---------------- */

export type Plan = {
  id: number;
  plan_name: string;
  price: number;
  duration: number;
  duration_type: "DAY" | "WEEK" | "MONTH" | "YEAR";
  created_at?: string;
  updated_at?: string;
};

export type CreatePlanDTO = {
  plan_name: string;
  price: number;
  duration: number;
  duration_type: "DAY" | "WEEK" | "MONTH" | "YEAR";
};

export type UpdatePlanDTO = Partial<CreatePlanDTO>;

/* ---------------- CREATE PLAN ---------------- */

export const createPlanApi = async (data: CreatePlanDTO) => {
  const res = await api.post("/plans/create", data);
  return res.data;
};

/* ---------------- GET ALL PLANS ---------------- */

export const getPlansApi = async () => {
  const res = await api.get("/plans");
  return res.data;
};

/* ---------------- GET PLAN BY ID ---------------- */

export const getPlanByIdApi = async (id: number) => {
  const res = await api.get(`/plans/${id}`);
  return res.data;
};

/* ---------------- UPDATE PLAN ---------------- */

export const updatePlanApi = async (id: number, data: UpdatePlanDTO) => {
  const res = await api.put(`/plans/update/${id}`, data);
  return res.data;
};

/* ---------------- DELETE PLAN ---------------- */

export const deletePlanApi = async (id: number) => {
  const res = await api.delete(`/plans/delete/${id}`);
  return res.data;
};