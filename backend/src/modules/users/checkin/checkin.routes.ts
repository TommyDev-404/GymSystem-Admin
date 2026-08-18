import { Router } from "express";
import * as controller from "./checkin.controller";
//import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/:member_id", controller.checkInController);
router.get("/:member_id/progress", controller.getMemberWeeklyAttendanceController);

export default router;