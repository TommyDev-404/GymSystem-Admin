import { Request, Response } from "express";
import * as service from "./rewards.service";

export const getRewardController = async (req: Request, res: Response) => {
  try {
    const result = await service.getAllRewardsService();

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to get all reward" });
  }
};

export const createRewardController = async (req: Request, res: Response) => {
  try {
    const result = await service.createRewardService(req.body);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to create reward" });
  }
};

export const updateRewardController = async (req: Request, res: Response) => {
 try {
   const result = await service.updateRewardService(Number(req.params.id), req.body);

   res.status(200).json(result);
 } catch (err) {
   res.status(500).json({ error: "Failed to create reward" });
 }
};

export const deleteRewardController = async (req: Request, res: Response) => {
 try {
   const result = await service.deleteRewardService(Number(req.params.id));

   res.status(200).json(result);
 } catch (err) {
   res.status(500).json({ error: "Failed to delete reward" });
 }
};

export const getMemberProgressController = async (req: Request, res: Response) => {
  try {
    const result = await service.getMemberProgressService();
 
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch member progress" });
  }
};

export const getSummaryDataController = async (req: Request, res: Response) => {
  try {
    const result = await service.getSummaryDataService();
 
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summary data" });
  }
};

export const getAllRewardRedemptionsController = async (req: Request, res: Response) => {
	try {
		const redemptions = await service.getAllRewardRedemptionsService();

		return res.status(200).json(redemptions);
	} catch(error:any) {
		console.error(error);

		return res.status(500).json({
			success:false,
			message: error.message || "Failed to retrieve reward redemptions"
		});
	}
};

export const updateRewardRedemptionStatusController = async (req: Request, res: Response) => {
	try {
		const redemption_id =Number(req.params.id);
		const { status } = req.body;

		if (!redemption_id){
			return res.status(400).json({
				success:false,
				message:"Redemption ID is required"
			});
		}

		if ( status !== "Claimed" && status !== "Cancelled"){
		return res.status(400).json({
				success:false,
				message:"Invalid redemption status"
			});
		}

		const result = await service.updateRewardRedemptionStatusService(redemption_id, status);

		return res.status(200).json(result);
	} catch(error:any){
		console.error(error);
		return res.status(400).json({
			success:false,
			message: error.message || "Failed to update reward redemption"
		});
	}
};