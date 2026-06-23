import { Router } from "express";
import * as controller from "./plan.controller";

const router = Router();

router.get("/", controller.getPlansController);

router.post("/create", controller.createPlanController);

router.put(
  "/update/:id",
  controller.updatePlanController
);

router.delete(
  "/delete/:id",
  controller.deletePlanController
);

export default router;