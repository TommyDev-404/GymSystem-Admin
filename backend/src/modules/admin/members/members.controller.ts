import { Request, Response } from "express";
import * as service from "./members.service";


export const getMembersSummaryController = async (req: Request, res: Response) => {
	try {
		const data = await service.getMemberSummaryService();
		
		return res.status(200).json(data);
	} catch (err: any) {
		console.log(err);
		return res.status(500).json({
			message: err.message || "Failed to fetch members summary",
		});
	}
};

export const getMembersController = async (req: Request, res: Response) => {
	try {
		const data = await service.getMembersService(req.query);
		
		return res.status(200).json(data);
	} catch (err: any) {
		console.log(err);
		return res.status(500).json({
			message: err.message || "Failed to fetch members",
		});
	}
};

export const createMemberController = async (req: Request, res: Response) => {
	try {
		const result = await service.createMemberService(req.body);
		
		return res.status(201).json(result);
	} catch (err: any) {
		console.log(err);
		return res.status(400).json({
			message: err.message || "Failed to create member",
		});
	}
};

export const upgradeMembershipPlanController = async (req: Request, res: Response) => {
	try {
		const result = await service.upgradeMembershipPlanService(Number(req.params.member_id), req.body.data);

		return res.status(200).json(result);
	} catch (err: any) {
		return res.status(400).json({
			message: err.message || "Failed to update member",
		});
	}
};

export const resendActivationController = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		const result = await service.resendActivationCodeService(email);

		return res.status(200).json(result);
	} catch (error: any) {
		res.status(400).json({
			message: error.message || "Failed to resend activation code",
		});
	}
};

export const renewMembershipController = async (req: Request, res: Response) => {
	try {
		const result = await service.renewMembershipServiceService(req.body);

		return res.status(200).json(result);
	} catch (error: any) {
		res.status(400).json({
			message: error.message || "Failed to renew membership",
		});
	}
};