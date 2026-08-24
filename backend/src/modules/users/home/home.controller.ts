import { Request, Response } from "express";
import * as service from "./home.service";

export const getMemberDashboardDataController = async (req: Request, res: Response) => {
   try {
      const data = await service.getMemberDashboardDataService(Number(req.params.member_id));
      
      return res.status(201).json(data);
   } catch (err: any) {
      console.log(err);

      return res.status(400).json({
         message: err.message,
      });
   }
};

export const getMemberAttendanceHistoryController = async (req: Request, res: Response) => {
   try {
      const data = await service.getMemberAttendanceHistoryService(Number(req.params.member_id));
      
      return res.status(201).json(data);
   } catch (err: any) {
      console.log(err);
      return res.status(400).json({
         message: err.message,
      });
   }
};

export const getMemberRecentActivityController = async (req: Request, res: Response) => {
   try {
      const data = await service.getRecentActivityService(Number(req.params.member_id));
      
      return res.status(201).json(data);
   } catch (err: any) {
      console.log(err);
      return res.status(400).json({
         message: err.message,
      });
   }
};

export const getFitnessGoalController = async(req:Request, res:Response)=>{
   try{
      const data = await service.getFitnessGoalService(Number(req.params.member_id));

      res.status(200).json(data);
   }catch(error:any){
      console.log(error);
      res.status(500).json({
         message:error.message
      });
   }
};

export const getFitnessGoalHistoryController = async(req:Request, res:Response) => {
   try{
      const data = await service.getFitnessProgressHistoryService(Number(req.params.member_id));

      res.status(200).json(data);
   }catch(error:any){
      console.log(error);
      res.status(500).json({
         message:error.message
      });
   }
};

export const getTabBadgesController = async (req: Request, res: Response) => {
   try{
      const result = await service.getTabBadgeCounts(Number(req.params.member_id));

      res.status(201).json(result);
   }catch(error:any){
      console.log(error);
      
      res.status(500).json({
         message:error.message
      });
   }
};


export const createFitnessGoalController = async(req:Request, res:Response)=>{
   try{
      const result = await service.createFitnessGoalService(Number(req.params.member_id), req.body);

      res.status(201).json(result);
   }catch(error:any){
      console.log(error);
      res.status(500).json({
         message:error.message
      });
   }
};

export const updateFitnessGoalController = async(req:Request, res:Response)=>{
   try{
      const result = await service.updateFitnessGoalService(Number(req.params.member_id), req.body);

      res.status(201).json(result);
   }catch(error:any){
      console.log(error);
      
      res.status(500).json({
         message:error.message
      });
   }
};


 