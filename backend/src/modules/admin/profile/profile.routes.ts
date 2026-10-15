import { Router } from "express";
import * as controller from "./profile.controller.js";

const router = Router();

router.get("/profile/:id", controller.getAdminProfileController);
router.patch("/update-info/:id", controller.updateAdminProfileController);
router.patch("/update-password/:id", controller.updateAdminPasswordController);

export default router;