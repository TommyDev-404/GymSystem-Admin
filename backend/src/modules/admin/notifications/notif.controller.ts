import { Request, Response } from "express";
import * as service from "./notif.service";

export const getAllNotificationsController = async (req: Request, res: Response) => {
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

export const getNotificationCountController = async (
   req: Request,
   res: Response
 ) => {
   try {
     const data = await service.getNotificationCountService();
 
     return res.status(200).json(data);
   } catch (err: any) {
     return res.status(400).json({
       message: err.message || "Failed to fetch notification count",
     });
   }
 };

export const markNotifAsReadController = async (
   req: Request,
   res: Response
 ) => {
   try {
     const { id } = req.params;
 
     const data = await service.markNotificationAsReadService(Number(id));
 
     return res.status(200).json({
       message: "Notification marked as read",
       data,
     });
   } catch (err: any) {
     return res.status(400).json({
       message: err.message || "Failed to mark notification as read",
     });
   }
};
 
export const markAllNotifAsReadController = async (
   req: Request,
   res: Response
 ) => {
   try {
     const data = await service.markAllNotificationsAsReadService();
 
     return res.status(200).json({
       message: "All notifications marked as read",
       data,
     });
   } catch (err: any) {
     return res.status(400).json({
       message: err.message || "Failed to mark all notifications as read",
     });
   }
};
 
export const deleteNotificationController = async (
   req: Request,
   res: Response
 ) => {
   try {
     const { id } = req.params;
 
     const data = await service.deleteNotificationService(Number(id));
 
     return res.status(200).json({
       message: "Notification deleted successfully",
       data,
     });
   } catch (err: any) {
     return res.status(400).json({
       message: err.message || "Failed to delete notification",
     });
   }
 };