import express from "express";

import {
    addDelinquencies,
    addDelinquenciesByList,
    getDelinquenciesByLoanIds,
} from "../controllers/DelinquencyController";

const router = express.Router();

router.get("/loan-ids", getDelinquenciesByLoanIds);

router.post("/", addDelinquencies);
router.post("/list", addDelinquenciesByList);

export = router;
