import { Router } from "express";
import { chatWithCoach } from "./ai.controller.js";

const router = Router();

router.post(
  "/:member_id",
  //authenticate,
  chatWithCoach,
);

export default router;