import { api } from "@/lib/axios";
import type { CreatePlanDTO, UpdatePlanDTO } from "../types/plans.types";

export const createPlanApi = async (data: CreatePlanDTO) => {
  const res = await api.post("/plans/create", data);
  return res.data;
};

export const getPlansApi = async () => {
  const res = await api.get("/plans");
  return res.data;
};

export const getPlanByIdApi = async (id: number) => {
  const res = await api.get(`/plans/${id}`);
  return res.data;
};

export const updatePlanApi = async (data: UpdatePlanDTO[]) => {
  const res = await api.patch(`/plans/update`, data);
  return res.data;
};

export const deletePlanApi = async (id: number) => {
  const res = await api.delete(`/plans/delete/${id}`);
  return res.data;
};