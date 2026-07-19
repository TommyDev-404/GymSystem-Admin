import { Request, Response } from "express";
import * as service from "./profile.service";


export const getAdminProfileController = async (req: Request, res: Response) => {
  try {
    const adminId = Number(req.params.id);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await service.getAdminProfileService(adminId);

      return res.status(200).json(result);
   } catch (error) {
      return res.status(404).json({
         success: false,
         message: "Admin profile not found",
      });
   }
};

export const updateAdminProfileController = async (req: Request, res: Response) => {
  try {
    const adminId = Number(req.params.id);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const data = await service.updateAdminProfileService(adminId, req.body);

      return res.status(200).json({
        success: true,
        message: "Admin profile updated successfully",
        data
      });
   } catch (error) {
      return res.status(404).json({
         success: false,
         message: "Admin profile not found",
      });
   }
};

export const updateAdminPasswordController = async (req: Request, res: Response) => {
  try {
    const adminId = Number(req.params.id);

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { newPassword } = req.body;

    await service.updateAdminPasswordService(adminId, newPassword);

      return res.status(200).json({
         success: true,
         message: "Admin password updated successfully",
      });
   } catch (error) {
      return res.status(404).json({
         success: false,
         message: "Admin profile not found",
      });
   }
};