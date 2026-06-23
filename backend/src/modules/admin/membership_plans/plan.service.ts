import * as repo from "./plan.repository";
import { CreatePlanDTO, UpdatePlanDTO } from "./plan.types";

export const getPlans = async () => {
  return repo.getPlans();
};

export const createPlan = async (
  data: CreatePlanDTO
) => {
  return repo.createPlan(data);
};

export const updatePlan = async (
  id: number,
  data: UpdatePlanDTO
) => {
  const plan = await repo.findPlanById(id);

  if (!plan) {
    throw new Error("Plan not found");
  }

  return repo.updatePlan(id, data);
};

export const deletePlan = async (
  id: number
) => {
  const plan = await repo.findPlanById(id);

  if (!plan) {
    throw new Error("Plan not found");
  }

  return repo.deletePlan(id);
};