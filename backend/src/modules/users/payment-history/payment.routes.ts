import { Router } from "express";
import * as controller from "./payment.controller";


const router = Router();

router.get("/:id", controller.getMemberPaymentHistoryController);


export default router;