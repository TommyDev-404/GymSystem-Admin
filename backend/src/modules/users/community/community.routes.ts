import { Router } from "express";
import multer from "multer";
import * as controller from "./community.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post(
   "/post/:id",
   upload.array("files", 10),
   controller.createPostController
);

router.get("/get-posts/:id", controller.getCommunityPostsController);
router.get("/get-my-posts/:id", controller.getUserPostsController);
router.post("/toggle-like/:id/:postId", controller.toggleLikeController);
router.post("/add-comment/:id/:postId", controller.addCommentController);
router.get("/posts/:postId/comments", controller.getCommentsController);

export default router;

