import { Request, Response } from "express";
import * as service from "./notif.service";

export const getAllNotificationsController = async (req: Request, res: Response) => {
   try {
      const data = await service.getAllNotificationsService(Number(req.params.id));
   
      return res.status(201).json(data);
   } catch (err: any) {
      return res.status(400).json({
         message: err.message || "Failed to fetch all notifications",
      });
   }
}; 