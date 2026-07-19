import { Router } from "express";
import { authMiddleware } from "../../../middlewares/auth";
import * as controller from "./profile.controller";

const router = Router();

//router.use(authMiddleware);

router.get("/profile/:id", controller.getAdminProfileController);
router.patch("/update-info/:id", controller.updateAdminProfileController);
router.patch("/update-password/:id", controller.updateAdminPasswordController);

export default router;