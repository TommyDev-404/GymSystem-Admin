import { Request, Response } from "express";
import * as service from "./plan.service";

export const getPlansController = async (
  req: Request,
  res: Response
) => {
  const plans = await service.getPlansService();

  return res.json(plans);
};

export const createPlanController = async (
  req: Request,
  res: Response
) => {
  const plan = await service.createPlanService(req.body);

  return res.status(201).json({
    success: true,
    message: "Plan created successfully"
  });
};

export const updatePlanController = async (
  req: Request,
  res: Response
) => {
  const plan = await service.updatePlansService(req.body);

  return res.json({
    success: true,
    message: "Plan updated successfully"
  });
};

export const deletePlanController = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);; // Log the ID for debugging

  await service.deletePlanService(id);

  return res.json({
    success: true,
    message: "Plan deleted successfully",
  });
};