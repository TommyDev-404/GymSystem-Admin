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

export const getWorkoutProgressController = async (
  req: Request,
  res: Response
) => {
  try {
    const { member_id } = req.params;

    if (!member_id) {
      return res.status(400).json({
        success: false,
        message: "Member ID is required.",
      });
    }

    const progress = await service.getWorkoutProgressService(
        Number(member_id)
      );

    return res.status(200).json(progress);
  } catch (error) {
    console.error(
      "Get workout progress error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to get workout progress.",
    });
  }
};

export const getWorkoutSummaryController = async (
  req: Request,
  res: Response
) => {
  try {
    const { memberId } = req.params;

    const summary =
      await service.getWorkoutSummaryService(
        Number(memberId)
      );

    return res.status(200).json(summary);
  } catch (error) {
    console.error(
      "Get workout summary error:",
      error
    );

    return res.status(500).json({
      message: "Failed to get workout summary",
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
    console.log(error);
    res.status(500).json({
      message: "Failed to create workout",
      error,
    });

  }
};