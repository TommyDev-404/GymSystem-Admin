import { Router } from "express";
import * as controller from "./reward.controller";


const router = Router();

router.get("/", controller.getAllRewardsController);
router.get("/redeemed/:member_id", controller.getMemberRedeemedRewardsController);
router.post("/:member_id/redeem/:reward_id", controller.redeemRewardController);
router.patch("/redeemed/cancel/:member_id/:redemption_id", controller.cancelRedeemedRewardController);
 
export default router;