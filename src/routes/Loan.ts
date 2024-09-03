import express from "express";

import {
    addLoan,
    addLoansByList,
    getByReportId,
} from "../controllers/LoanController";

const router = express.Router();

router.post("/addLoan", addLoan);
router.post("/addLoansByList", addLoansByList);
router.get("/getByReportId/:reportId", getByReportId);

export = router;
