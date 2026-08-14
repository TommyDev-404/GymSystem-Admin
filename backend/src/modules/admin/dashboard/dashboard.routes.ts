import { Router } from "express";
import * as controller from "./dashboard.controller";

const router = Router();

router.get("/summary", controller.getDashboardSummaryDataController);
router.get("/revenue-trend", controller.getMonthlyRevenueTrendController);
router.get("/weekly-attendance", controller.getWeeklyAttendanceController);
router.get("/member-status", controller.getMembersStatusController);
router.get("/gender-distribution", controller.getGenderDistributionController);
router.get("/top-claimed-rewards", controller.getTopClaimedRewardsController);
router.get("/recent-activity", controller.getRecentActivityController);
router.get("/memberships-expiry", controller.getMembershipsExpiringSoonController);

export default router;