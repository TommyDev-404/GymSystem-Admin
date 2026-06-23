import { Router } from "express";
import { PaymentController } from "./payments.controller";

const router = Router();

// Create payment
router.post("/add", PaymentController.createPayment);

// Get payments (filter + search)
router.get("/", PaymentController.getPayments);

router.get("/unpaid-members", PaymentController.getUnpaidMembers);


export default router;