import { Router } from "express";
import * as controller from "./plan.controller.js";

const router = Router();

router.get("/", controller.getPlansController);
router.post("/create", controller.createPlanController);
router.patch("/update", controller.updatePlanController);
router.delete("/delete/:plan_id", controller.deletePlanController);

export default router;