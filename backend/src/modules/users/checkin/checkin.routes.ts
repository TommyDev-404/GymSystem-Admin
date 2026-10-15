import { Router } from "express";
import * as controller from "./checkin.controller.js";

const router = Router();

router.post("/:member_id", controller.checkInController);
router.get("/:member_id/progress", controller.getMemberWeeklyAttendanceController);

export default router;