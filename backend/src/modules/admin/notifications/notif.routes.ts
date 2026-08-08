import { Router } from "express";
import * as controller from "../notifications/notif.controller"

const router = Router();

router.get('/', controller.getAllNotificationsController)
router.get("/count", controller.getNotificationCountController);
router.patch("/:notif_id/read", controller.markNotifAsReadController);
router.patch("/read-all", controller.markAllNotifAsReadController);
router.delete("/:notif_id", controller.deleteNotificationController);
 
export default router;