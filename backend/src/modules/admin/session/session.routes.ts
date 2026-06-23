import { Router } from "express";
import {
  createSessionController,
  getTodayQrController
} from "./session.controller";

const router = Router();

// Admin creates session manually
router.post("/create", createSessionController);

// Get today's QR
router.get("/qr", getTodayQrController);

export default router;