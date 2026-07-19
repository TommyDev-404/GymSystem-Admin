import { Request, Response } from "express";
import * as service from "./rewards.service";

export const getRewardController = async (req: Request, res: Response) => {
  console.log('Getting reward...');
  try {
    const result = await service.getAllRewardsService();

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to get all reward" });
  }
};

export const createRewardController = async (req: Request, res: Response) => {
  try {
    const result = await service.createRewardService(req.body);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to create reward" });
  }
};

export const updateRewardController = async (req: Request, res: Response) => {
 try {
   const result = await service.updateRewardService(Number(req.params.id), req.body);

   res.json(result);
 } catch (err) {
   res.status(500).json({ error: "Failed to create reward" });
 }
};

export const deleteRewardController = async (req: Request, res: Response) => {
 try {
   const result = await service.deleteRewardService(Number(req.params.id));

   res.json(result);
 } catch (err) {
   res.status(500).json({ error: "Failed to delete reward" });
 }
};

export const getMemberProgressController = async (req: Request, res: Response) => {
  try {
    const result = await service.getMemberProgressService();
 
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch member progress" });
  }
};

export const getSummaryDataController = async (req: Request, res: Response) => {
  try {
    const result = await service.getSummaryDataService();
 
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch summary data" });
  }
};