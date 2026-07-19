import { Router } from "express";
import multer from "multer";
import * as controller from "./tutorials.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
  "/create",
  upload.array("demo_images", 10),
  controller.createTutorial
);

router.patch(
  "/update/:id",
  upload.array("demo_images"),
  controller.updateTutorialController
);

router.get("/all", controller.getAllTutorials);
router.delete("/remove/:id", controller.removeTutorialController);

export default router;