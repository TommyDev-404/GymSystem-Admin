import { Router } from "express";
import * as controller from "./attendance.controller";
//import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", controller.getAttendanceController);
router.post("/checkout/:attendance_id", controller.markCheckoutController);

export default router;