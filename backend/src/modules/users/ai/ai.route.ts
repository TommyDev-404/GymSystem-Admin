import { Router } from "express";
import { chatWithCoach } from "./ai.controller";

const router = Router();

router.post(
  "/:member_id",
  //authenticate,
  chatWithCoach,
);

export default router;