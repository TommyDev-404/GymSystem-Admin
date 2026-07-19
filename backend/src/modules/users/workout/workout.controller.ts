import { Request, Response } from "express";
import * as service from "./workout.service";

export const getWorkoutTutorials = async (req: Request, res: Response) => {
  try {
    const data = await service.getWorkoutTutorialsService(req.query);

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch workout tutorials",
    });
  }
};

export const getPersonalWorkoutHistoryController = async (req: Request, res: Response) => {
  try {
    const data = await service.getPersonalWorkoutHistoryService(Number(req.params.id));

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch workout tutorials",
    });
  }
};

export const createPersonalWorkoutController = async (req: Request, res: Response) => {
  try {
    const member_id = req.params.id;

    const result = await service.createPersonalWorkoutService({
      member_id,
      ...req.body,
    });

    res.status(201).json(result);

  } catch (error) {

    res.status(500).json({
      message: "Failed to create workout",
      error,
    });

  }
};