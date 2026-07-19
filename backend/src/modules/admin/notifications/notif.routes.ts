import { Router } from "express";
import * as controller from "../notifications/notif.controller"

const router = Router();

router.get('/', controller.getAllNotificationsController)

export default router;