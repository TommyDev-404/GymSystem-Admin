import { Router } from "express";
import * as controller from "./home.controller";

const router = Router();

router.get('/member-stat/:id', controller.getMemberDashboardDataController)
router.get('/member-attendance/:id', controller.getMemberAttendanceHistoryController)
router.get('/recent-activity/:id', controller.getMemberRecentActivityController)

export default router;