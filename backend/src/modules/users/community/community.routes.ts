import { Router } from "express";
import multer from "multer";
import * as controller from "./community.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
});


router.get("/get-posts/:member_id", controller.getCommunityPostsController);
router.get("/get-my-posts/:member_id", controller.getUserPostsController);
router.get("/posts/:postId/comments", controller.getCommentsController);

router.post(
   "/post/:member_id",
   upload.array("files", 10),
   controller.createPostController
);
router.post("/toggle-like/:member_id/:postId", controller.toggleLikeController);
router.post("/add-comment/:member_id/:postId", controller.addCommentController);

export default router;

