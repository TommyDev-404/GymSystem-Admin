import express from "express";
import * as controller from "./workout.controller";

const router = express.Router();

router.get("/tutorials", controller.getWorkoutTutorials);
router.get("/personal-workout/:id", controller.getPersonalWorkoutHistoryController);
router.post("/add-personal-workout/:id", controller.createPersonalWorkoutController);
router.get(
  "/:member_id/progress",
  controller.getWorkoutProgressController
);
router.get(
   "/:memberId/summary",
   controller.getWorkoutSummaryController
 );


export default router;