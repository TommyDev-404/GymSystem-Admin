import { Router } from "express";
import * as controller from "./members.controller";

const router = Router();

router.post("/add", controller.createMemberController);
router.put("/update/:id", controller.updateMemberController);
router.delete("/delete/:id", controller.deleteMemberController);
router.get("/", controller.getMembersController);
router.get("/:id", controller.getMemberByIdController);
router.post("/resend", controller.resendActivationController);

export default router;