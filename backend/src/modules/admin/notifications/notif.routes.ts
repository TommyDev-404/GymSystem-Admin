import { Router } from "express";
import * as controller from "../notifications/notif.controller"

const router = Router();

router.get('/', controller.getAllNotificationsController)
router.get("/count", controller.getNotificationCountController);
router.patch("/:id/read", controller.markNotifAsReadController);
router.patch("/read-all", controller.markAllNotifAsReadController);
router.delete("/:id", controller.deleteNotificationController);
 
export default router;