import express from "express";

import {
    addLoan,
    addLoansByList,
    getLoansByReportId,
} from "../controllers/LoanController";

const router = express.Router();

router.get("/:reportId", getLoansByReportId);

router.post("/", addLoan);
router.post("/list", addLoansByList);

export = router;
