import { Request, Response } from "express";
import * as service from "./reward.service";


export const getAllRewardsController = async (req: Request, res: Response) => {
	try {
		const rewards = await service.getAllRewardsService();

		return res.status(200).json(rewards);
	} catch (error) {
		console.error(error);
		return res.status(500).json({
			success:false,
			message:"Failed to retrieve rewards"
		});
	}
};

export const getMemberRedeemedRewardsController = async (req: Request, res: Response) => {
	try {
		const member_id = Number(req.params.member_id);

		if (!member_id) {
			return res.status(400).json({
				message: "Member ID is required",
			});
		}

		const rewards = await service.getMemberRedeemedRewardsService(member_id);

		return res.status(200).json(rewards);
	} catch (error) {
		console.error("Get redeemed rewards error:", error);

		return res.status(500).json({
			message: "Failed to fetch redeemed rewards",
		});
	}
};

export const redeemRewardController = async (req: Request, res: Response) => {
	try {
		const member_id = Number(req.params.member_id);
		const reward_id = Number(req.params.reward_id);

		if(!member_id || !reward_id){
			return res.status(400).json({
				success:false,
				message:"Member ID and Reward ID are required"
			});
		}

		const result = await service.redeemRewardService(member_id, reward_id);

		return res.status(201).json(result);
	} catch(error:any){
		console.error(error);

		return res.status(400).json({
			success:false,
			message:error.message || "Failed to redeem reward"
		});
	}
};

export const cancelRedeemedRewardController = async (req: Request, res: Response) => {
	try {
		const redemption_id = Number(req.params.redemption_id);
		const member_id = Number(req.params.member_id);

		const result = await service.cancelRedeemedRewardService(redemption_id, member_id);

		return res.status(200).json(result);
	} catch (error: any) {
		console.error(error);

		return res.status(400).json({
			message: error.message,
		});
	}
};