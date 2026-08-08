import { Router } from "express";
import * as controller from "./home.controller";

const router = Router();

router.get('/member-stat/:id', controller.getMemberDashboardDataController)
router.get('/member-attendance/:id', controller.getMemberAttendanceHistoryController)
router.get('/recent-activity/:id', controller.getMemberRecentActivityController)
router.post("/create-fitness-goal", controller.createFitnessGoalController);
router.patch("/update-fitness-goal/:id", controller.updateFitnessGoalController);
router.get("/member-fitness-goal/:member_id", controller.getFitnessGoalController);
router.get("/member-fitness-goal-history/:member_id", controller.getFitnessGoalHistoryController);

export default router;