import express from "express";
import * as controller from "./workout.controller";

const router = express.Router();

router.get("/tutorials", controller.getWorkoutTutorials);
router.get("/info/:workoutId", controller.getWorkoutInfo);
router.get("/personal-workout/:member_id", controller.getPersonalWorkoutHistoryController);
router.post("/add-personal-workout/:member_id", controller.createPersonalWorkoutController);
router.get("/:member_id/progress", controller.getWorkoutProgressController);
router.get("/:member_id/summary", controller.getWorkoutSummaryController);
router.get("/search", controller.searchExercisesController);


export default router;