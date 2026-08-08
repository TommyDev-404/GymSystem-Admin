import { Router } from "express";
import * as controller from "./notif.controller";

const router = Router();

router.get('/:member_id', controller.getAllNotificationsController)
router.patch("/:notification_id/read/:member_id", controller.markNotificationAsReadController);
router.patch("/mark-all-read/:member_id", controller.markAllNotifAsReadController);

export default router;