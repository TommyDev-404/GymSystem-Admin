import { Request, Response } from "express";
import * as service from "./notif.service";

export const getAllNotificationsController = async (req: Request, res: Response) => {
   console.log(req.query)
   try {
      const { type } = req.query;
      const data = await service.getAllNotificationsService({ type });
   
      return res.status(201).json(data);
   } catch (err: any) {
      return res.status(400).json({
         message: err.message || "Failed to fetch all notifications",
      });
   }
}; 