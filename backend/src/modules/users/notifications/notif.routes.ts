import { Router } from "express";
import * as controller from "./notif.controller";

const router = Router();

router.get('/:id', controller.getAllNotificationsController)

export default router;