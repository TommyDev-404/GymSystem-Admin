import { Request, Response } from "express";
import  * as service from "./dashboard.service";

export const getDashboardSummaryDataController = async (req: Request, res: Response) => {
   try {
      const result = await service.getSummaryDataService();

      return res.status(201).json(result);
   } catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Failed to fetch summary data in dashboard" });
   }
};

export const getMonthlyRevenueTrendController = async (req: Request, res: Response) => {
   try {
      const result = await service.getMonthlyRevenueTrendService();

      return res.status(201).json(result);
   } catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Failed to fetch monthly revenue trend" });
   }
};

export const getWeeklyAttendanceController = async (req: Request, res: Response) => {
   try {
      const result = await service.getWeeklyGuestAttendanceService();

      return res.status(201).json(result);
   } catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Failed to fetch weekly attendance" });
   }
};

export const getMembersStatusController = async (req: Request, res: Response) => {
   try {
      const result = await service.getMembershipStatusService();

      return res.status(201).json(result);
   } catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Failed to fetch membership status" });
   }
};

export const getGenderDistributionController = async (req: Request, res: Response) => {
   try {
      const result = await service.getGenderDistributionService();

      return res.status(201).json(result);
   } catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Failed to fetch gender distribution" });
   }
};

export const getTopClaimedRewardsController = async (req: Request, res: Response) => {
   try {
      const result = await service.getTopClaimedRewardsService();

      return res.status(201).json(result);
   } catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Failed to fetch top claimed rewards" });
   }
};

export const getRecentActivityController = async (req: Request, res: Response) => {
   try {
      const result = await service.getRecentActivityService();

      return res.status(201).json(result);
   } catch (err) {
      console.log(err)
      return res.status(500).json({ message: "Failed to fetch recent activity" });
   }
};