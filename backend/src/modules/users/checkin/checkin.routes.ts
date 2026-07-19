import { Router } from "express";
import { checkInController} from "./checkin.controller";
//import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/:id", checkInController);

export default router;