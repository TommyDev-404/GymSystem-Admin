import { Router } from "express";
import * as controller from "./members.controller";

const router = Router();

router.post("/add", controller.createMemberController);
router.patch("/update/:member_id", controller.updateMemberInfoController);
router.patch("/update-status/:member_id", controller.updateMemberStatusController);
router.delete("/delete/:member_id", controller.deleteMemberController);
router.get("/", controller.getMembersController);
router.get("/:member_id", controller.getMemberByIdController);
router.post("/resend", controller.resendActivationController);
router.post("/renew-membership", controller.renewMembershipController);

export default router;