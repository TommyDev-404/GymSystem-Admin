import { Request, Response } from "express";
import * as service from "./members.service";

export const createMemberController = async (req: Request, res: Response) => {
	try {
		const data = await service.createMember(req.body);
		
		return res.status(201).json(data);
	} catch (err: any) {
		return res.status(400).json({
			message: err.message || "Failed to create member",
		});
	}
};

export const updateMemberInfoController = async (req: Request, res: Response) => {
	try {
		const data = await service.updateMemberInfo(Number(req.params.id), req.body);

		return res.status(200).json(data);
	} catch (err: any) {
		return res.status(400).json({
			message: err.message || "Failed to update member",
		});
	}
};

export const updateMemberStatusController = async (req: Request, res: Response) => {
	try {
		const data = await service.updateMemberStatus(Number(req.params.id), req.body);

		return res.status(200).json(data);
	} catch (err: any) {
		return res.status(400).json({
			message: err.message || "Failed to update status",
		});
	}
};

export const deleteMemberController = async (req: Request, res: Response) => {
	try {
		await service.deleteMember(Number(req.params.id));

		return res.status(200).json({
			message: "Member deleted",
		});
	} catch (err: any) {
		return res.status(400).json({
			message: err.message || "Failed to delete member",
		});
	}
};

export const getMembersController = async (req: Request, res: Response) => {
	try {
		const data = await service.getMembers(req.query);
		return res.status(200).json(data);

	} catch (err: any) {
		return res.status(500).json({
			message: err.message || "Failed to fetch members",
		});
	}
};

export const getMemberByIdController = async (req: Request, res: Response) => {
	try {
		const data = await service.getMemberById(Number(req.params.id));

		return res.status(200).json(data);
	} catch (err: any) {
		return res.status(404).json({
			message: err.message || "Member not found",
		});
	}
};

export const resendActivationController = async (req: Request, res: Response) => {
	try {
		const { email } = req.body;
		const result = await service.resendActivationCode(email);

		return res.status(200).json(result);
	} catch (error: any) {
		res.status(400).json({
			message: error.message || "Failed to resend activation code",
		});
	}
};