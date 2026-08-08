import { Router } from "express";
import * as controller from "./referral.controller";

const router = Router();

router.get('/:member_id', controller.getMemberReferralDataController);
router.get('/records/:member_id', controller.getMemberReferralRecordsController);

export default router;