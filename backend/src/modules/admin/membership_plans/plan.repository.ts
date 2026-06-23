import { prisma } from "../../../lib/prisma";
import { CreatePlanDTO, UpdatePlanDTO } from "./plan.types";

export const getPlans = () => {
  return prisma.membership_plans.findMany({
    orderBy: {
      id: "desc",
    },
  });
};

export const findPlanById = (id: number) => {
  return prisma.membership_plans.findUnique({
    where: { id },
  });
};

export const createPlan = (data: CreatePlanDTO) => {
  return prisma.membership_plans.create({
    data,
  });
};

export const updatePlan = (
  id: number,
  data: UpdatePlanDTO
) => {
  return prisma.membership_plans.update({
    where: { id },
    data,
  });
};

export const deletePlan = (id: number) => {
  return prisma.membership_plans.delete({
    where: { id },
  });
};