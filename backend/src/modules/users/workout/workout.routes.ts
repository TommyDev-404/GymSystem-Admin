import express from "express";
import * as service from "./workout.controller";

const router = express.Router();

router.get("/tutorials", service.getWorkoutTutorials);
router.get("/personal-workout/:id", service.getPersonalWorkoutHistoryController);
router.post("/add-personal-workout/:id", service.createPersonalWorkoutController);

export default router;