import express from "express";

import {
    addPaymentHistory,
    addPaymentHistoriesByList,
    getPaymentHistoriesByLoanIds,
} from "../controllers/PaymentHistoryController";

const router = express.Router();

router.get("/loan-ids", getPaymentHistoriesByLoanIds);

router.post("/", addPaymentHistory);
router.post("/list", addPaymentHistoriesByList);

export = router;
