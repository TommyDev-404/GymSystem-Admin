import { Request, Response } from "express";
import * as service from "./home.service";

export const getMemberDashboardDataController = async (req: Request, res: Response) => {
   try {
      const data = await service.getMemberDashboardDataService(Number(req.params.id));
      
      return res.status(201).json(data);
   } catch (err: any) {
      return res.status(400).json({
         message: err.message || "Failed to create member",
      });
   }
};

export const getMemberAttendanceHistoryController = async (req: Request, res: Response) => {
   try {
      const data = await service.getMemberAttendanceHistoryService(Number(req.params.id));
      
      return res.status(201).json(data);
   } catch (err: any) {
      return res.status(400).json({
         message: err.message || "Failed to create member",
      });
   }
};

export const getMemberRecentActivityController = async (req: Request, res: Response) => {
   try {
      const data = await service.getRecentActivityService(Number(req.params.id));
      
      return res.status(201).json(data);
   } catch (err: any) {
      return res.status(400).json({
         message: err.message || "Failed to fetch recent activity",
      });
   }
};