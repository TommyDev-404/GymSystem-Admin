import { api } from "@/lib/axios";
import type { CreatePlanDTO, UpdatePlanDTO } from "../types/plans.types";

export const createPlanApi = async (data: CreatePlanDTO) => {
  try {
    const res = await api.post("/plans/create", data);
    return res.data;
  } catch (error) {
    console.log("Error: ", error)
  }
};

export const getPlansApi = async () => {
  try {
    const res = await api.get("/plans");
    return res.data;
  } catch (error) {
    console.log("Error: ", error)
  }
};

export const getPlanByIdApi = async (id: number) => {
  try {
    const res = await api.get(`/plans/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error: ", error)
  }
};

export const updatePlanApi = async (data: UpdatePlanDTO[]) => {
  try {
    const res = await api.patch(`/plans/update`, data);
    return res.data;
  } catch (error) {
    console.log("Error: ", error)
  }
};

export const deletePlanApi = async (id: number) => {
  try {
    const res = await api.delete(`/plans/delete/${id}`);
    return res.data;
  } catch (error) {
    console.log("Error: ", error)
  }
};