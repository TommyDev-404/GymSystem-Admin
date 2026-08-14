import { Router } from "express";
import * as controller from "./payments.controller";

const router = Router();

router.get("/", controller.getPaymentsController);
router.get("/summary", controller.getPaymentsSummaryController);

export default router;