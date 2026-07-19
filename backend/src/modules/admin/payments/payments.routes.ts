import { Router } from "express";
import * as controller from "./payments.controller";

const router = Router();

router.get("/summary", controller.getSummaryDataController)
router.post("/add", controller.createPaymentController);;
router.get("/", controller.getPaymentsController);
router.get("/unpaid-members", controller.getUnpaidMembersController);

export default router;