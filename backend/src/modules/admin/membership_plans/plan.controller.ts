import { Request, Response } from "express";
import * as service from "./plan.service";

export const getPlansController = async (
  req: Request,
  res: Response
) => {
  const plans = await service.getPlans();

  res.json(plans);
};

export const createPlanController = async (
  req: Request,
  res: Response
) => {
  const plan = await service.createPlan(req.body);

  res.status(201).json({
    message: "Plan created successfully",
    data: plan,
  });
};

export const updatePlanController = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  const plan = await service.updatePlan(
    id,
    req.body
  );

  res.json({
    message: "Plan updated successfully",
    data: plan,
  });
};

export const deletePlanController = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  await service.deletePlan(id);

  res.json({
    message: "Plan deleted successfully",
  });
};