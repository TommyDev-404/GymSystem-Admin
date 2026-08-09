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


export const createFitnessGoalController = async(req:Request, res:Response)=>{

 try{

   const goal =
    await service.createFitnessGoalService(
      req.body
    );


   res.status(201).json({
    message:"Fitness goal created",
    data:goal
   });


 }catch(error:any){

   res.status(500).json({
    message:error.message
   });

 }

};


export const updateFitnessGoalController = async(req:Request, res:Response)=>{
   console.log(req.body);
 try{

   const id = Number(req.params.id);

   const goal =
    await service.updateFitnessGoalService(
      id,
      req.body
    );


   res.json({
    message:"Fitness goal updated",
    data:goal
   });


 }catch(error:any){

   res.status(500).json({
    message:error.message
   });

 }


};

export const getFitnessGoalController = async(
 req:Request,
 res:Response
)=>{
 try{
  const member_id = Number(req.params.member_id);

  const goal = await service.getFitnessGoalService(member_id);
   
  res.status(200).json(goal);

 }catch(error:any){

  res.status(500).json({

    message:error.message

  });

 }

};

export const getFitnessGoalHistoryController = async(
  req:Request,
  res:Response
) => {
  try{
   const member_id = Number(req.params.member_id);
 
   const goal = await service.getFitnessProgressHistoryService(member_id);
 
    
   res.status(200).json(goal);
 
  }catch(error:any){
 
   res.status(500).json({
 
     message:error.message
 
   });
 
  }
 
 };
 