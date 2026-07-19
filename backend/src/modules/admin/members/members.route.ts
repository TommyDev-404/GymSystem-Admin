import { Router } from "express";
import * as controller from "./members.controller";

const router = Router();

router.post("/add", controller.createMemberController);
router.patch("/update/:id", controller.updateMemberInfoController);
router.patch("/update-status/:id", controller.updateMemberStatusController);
router.delete("/delete/:id", controller.deleteMemberController);
router.get("/", controller.getMembersController);
router.get("/:id", controller.getMemberByIdController);
router.post("/resend", controller.resendActivationController);

export default router;