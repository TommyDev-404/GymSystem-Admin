import { Router } from "express";
import {
  createSessionController,
  getTodayQrController
} from "./session.controller";

const router = Router();

router.post("/create", createSessionController);
router.get("/qr", getTodayQrController);

export default router;