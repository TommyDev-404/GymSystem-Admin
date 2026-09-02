import { Router } from "express";
import * as controller from "./profile.controller";
import multer from "multer";

const router = Router();

const upload = multer({
   storage: multer.memoryStorage(),
 });
 
 
router.get("/info/:user_id", controller.getProfileInfoController);
router.patch("/update-profile-info/:user_id", controller.updateProfileInfoController);
router.patch(
  "/update-profile-image/:user_id",
  upload.single("image"),
  controller.updateProfileImageController
);

export default router;