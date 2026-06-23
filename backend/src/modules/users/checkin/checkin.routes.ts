import { Router } from "express";
import { checkInController} from "./checkin.controller";
//import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

// member scans QR
router.post("/", checkInController);

export default router;