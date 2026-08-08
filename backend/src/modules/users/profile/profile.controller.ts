import { Request, Response } from "express";
import * as service from "./profile.service";

export const updateProfileInfoController = async (
	req: Request,
	res: Response
) => {
	try {
		const userId = Number(req.params.user_id);

		const { username, email } = req.body;

		const user = await service.updateProfileInfoService(
			userId,
			{
				username,
				email,
			}
		);

		res.status(200).json({
			message: "Profile updated successfully",
			data: user,
		});

	} catch (error: any) {
		res.status(500).json({
			message: error.message,
		});
	}
};

export const updateProfileImageController = async (
	req: Request,
	res: Response
 ) => {
	try {
	  const userId = Number(req.params.user_id);
		console.log("user: ", userId)
	  if (!req.file) {
		 return res.status(400).json({
			message: "Profile image is required",
		 });
	  }
 
	  const result = await service.updateProfileImageService(
		userId,
		 req.file
	  );
 
 
	  return res.status(200).json(result);
 
 
	} catch (err: any) {
 
	  return res.status(400).json({
		 message: err.message || "Failed to update profile",
	  });
 
	}
 
 };