import { Request, Response } from "express";
import * as service from "./notif.service";

export const getAllNotificationsController = async (req: Request, res: Response) => {
   try {
      const data = await service.getAllNotificationsService(Number(req.params.member_id));
   
      return res.status(201).json(data);
   } catch (err: any) {
      return res.status(400).json({
         message: err.message || "Failed to fetch all notifications",
      });
   }
}; 

export async function markNotificationAsReadController(req: Request, res: Response) {
   try {
     const notification_id = Number(req.params.notification_id);
     const member_id = Number(req.params.member_id);
 
     await service.markNotificationAsReadService(
       notification_id,
       member_id
     );
 
     res.status(200).json({
       message: "Marked as read successfully.",
     });
 
   } catch (error) {
     res.status(500).json({
       message: "Failed to mark notification as read",
     });
   }
}

export const markAllNotifAsReadController = async (req: Request, res: Response) => {
  try {
    const result = await service.markAllNotificationsAsReadService(Number(req.params.member_id));

    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(400).json({
      message: err.message || "Failed to mark all notifications as read",
    });
  }
};
 
