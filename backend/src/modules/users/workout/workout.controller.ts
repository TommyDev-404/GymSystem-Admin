import { Request, Response } from "express";
import * as service from "./workout.service";

export const getWorkoutTutorials = async (req: Request, res: Response) => {
	try {
		const data = await service.getWorkoutTutorialsService(req.query);

		return res.status(200).json(data);
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			success: false,
			message: "Failed to fetch workout tutorials",
		});
	}
};

export const getWorkoutInfo = async (req: Request, res: Response) => {
	try {
		const data = await service.getWorkoutTutorialByIdService(Number(req.params.workoutId));

		return res.status(200).json(data);
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			success: false,
			message: "Failed to fetch workout tutorials",
		});
	}
};

export const getPersonalWorkoutHistoryController = async (req: Request, res: Response) => {
	try {
		const data = await service.getPersonalWorkoutHistoryService(Number(req.params.member_id));

		return res.status(200).json(data);
	} catch (error) {
		console.log(error);

		return res.status(500).json({
			success: false,
			message: "Failed to fetch workout tutorials",
		});
	}
};

export const getWorkoutProgressController = async ( req: Request, res: Response) => {
	try {
		const { member_id } = req.params;

		if (!member_id) {
			return res.status(400).json({
				success: false,
				message: "Member ID is required.",
			});
		}

		const progress = await service.getWorkoutProgressService(Number(member_id));

		return res.status(200).json(progress);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			success: false,
			message: "Failed to get workout progress.",
		});
	}
};

export const getWorkoutSummaryController = async (req: Request, res: Response) => {
	try {
		const { member_id } = req.params;

		const summary = await service.getWorkoutSummaryService(Number(member_id));

		return res.status(200).json(summary);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to get workout summary",
		});
	}
};

export const createPersonalWorkoutController = async (req: Request, res: Response) => {
	try {
		const result = await service.createPersonalWorkoutService({
			member_id: Number(req.params.member_id),
			...req.body
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

export const searchExercisesController = async (req: Request, res: Response) => {
	try {
		const { search } = req.query;

		const exercises = await service.searchExercisesService(search as string);
		
		return res.status(200).json(exercises);
	} catch (error) {
		console.error(error);

		return res.status(500).json({
			message: "Failed to search exercises.",
		});
	}
};