import { Router } from "express";
import { getAttendanceController} from "./attendance.controller";
//import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", getAttendanceController);

export default router;