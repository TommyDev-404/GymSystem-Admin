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
	const result = await prisma.membership_plans.create({
		data,
	});

	if (!result) throw new Error("Failed to create");

	return {
		success: true,
		message: "Plan created successfully."
	}
};

export const updatePlansService = async (plans: UpdatePlanDTO[]) => {
	const result = await prisma.$transaction(
		plans.map((plan) =>
			prisma.membership_plans.update({
				where: {
					id: plan.id,
				},
				data: plan.data,
			})
		)
	);
	
	if (!result) throw new Error("Failed to update");

	return {
		success: true,
		message: "Plan update successfully."
	}
};

export const deletePlanService = async (id: number) => {
	const plan = await prisma.membership_plans.findUnique({
		where: { id },
	});

	if (!plan) {
		throw new Error("Plan not found");
	}

	const result = await prisma.membership_plans.delete({
		where: { id },
	});

	if (!result) throw new Error("Failed to remove");

	return {
		success: true,
		message: "Plan remove successfully."
	}
};