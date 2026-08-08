import { Router } from "express";
import * as controller from "./rewards.controller";

const router = Router();

router.get("/get-rewards", controller.getRewardController);
router.post("/create", controller.createRewardController);
router.patch("/update/:id", controller.updateRewardController);
router.delete("/delete/:id", controller.deleteRewardController);
router.get("/members-progress", controller.getMemberProgressController);
router.get("/card-data", controller.getSummaryDataController);
router.get("/redemptions", controller.getAllRewardRedemptionsController);
router.patch("/update-redemptions-status/:id", controller.updateRewardRedemptionStatusController);

export default router;