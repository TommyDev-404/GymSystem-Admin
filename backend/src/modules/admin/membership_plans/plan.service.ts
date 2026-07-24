import { prisma } from "../../../lib/prisma";
import { CreatePlanDTO, UpdatePlanDTO } from "./plan.types";

export const getPlansService = async () => {
  return await prisma.membership_plans.findMany({
    orderBy: {
      id: "desc",
    },
  });
};

export const createPlanService = async (data: CreatePlanDTO) => {
  return await prisma.membership_plans.create({
    data,
  });
};

export const updatePlansService = async (plans: UpdatePlanDTO[]) => {
  return await prisma.$transaction(
    plans.map((plan) =>
      prisma.membership_plans.update({
        where: {
          id: plan.id,
        },
        data: plan.data,
      })
    )
  );
};

export const deletePlanService = async (id: number) => {
  const plan = await prisma.membership_plans.findUnique({
    where: { id },
  });

  if (!plan) {
    throw new Error("Plan not found");
  }

  return await prisma.membership_plans.delete({
    where: { id },
  });
};