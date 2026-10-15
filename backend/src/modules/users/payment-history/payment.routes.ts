import { Router } from "express";
import * as controller from "./payment.controller.js";

const router = Router();

router.get("/:member_id", controller.getMemberPaymentHistoryController);


export default router;