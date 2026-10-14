import { Router } from "express";
import * as controller from "./members.controller";

const router = Router();

router.get("/summary", controller.getMembersSummaryController);
router.get("/", controller.getMembersController);
router.get("/:member_id/payment-history", controller.getMemberPaymentHistoryController);
router.post("/add", controller.createMemberController);
router.patch("/changed-membership-plan/:member_id", controller.upgradeMembershipPlanController);
router.post("/resend", controller.resendActivationController);
router.post("/renew-membership", controller.renewMembershipController);

export default router;