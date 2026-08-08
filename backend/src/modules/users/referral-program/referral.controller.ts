import { Request, Response } from "express";
import * as service from "./referral.service";

export const getMemberReferralDataController = async (req: Request, res: Response) => {
   try {
      const data = await service.getMemberReferralDataService(Number(req.params.member_id));
      
      return res.status(201).json(data);
   } catch (err: any) {
      return res.status(400).json({
         message: err.message || "Failed to retrieve member referral data",
      });
   }
};

export const getMemberReferralRecordsController = async (req: Request, res: Response) => {
   try {
      const data = await service.getMemberReferralRecordsService(Number(req.params.member_id));
      
      return res.status(201).json(data);
   } catch (err: any) {
      return res.status(400).json({
         message: err.message || "Failed to retrieve member referral records",
      });
   }
};