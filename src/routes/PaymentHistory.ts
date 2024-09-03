import express from "express";

import {
    addPaymentHistory,
    addPaymentHistoryByList,
    getByLoanIds,
} from "../controllers/PaymentHistoryController";

const router = express.Router();

router.post("/addPaymentHistory", addPaymentHistory);
router.post("/addPaymentHistoryByList", addPaymentHistoryByList);
router.get("/getByLoanIds", getByLoanIds);

export = router;
