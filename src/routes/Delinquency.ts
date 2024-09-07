import express from "express";

import {
    addDelinquency,
    addDelinquenciesByList,
    getByLoanIds,
} from "../controllers/DelinquencyController";

const router = express.Router();

router.post("/addDelinquency", addDelinquency);
router.post("/addDelinquenciesByList", addDelinquenciesByList);
router.get("/getByLoanIds", getByLoanIds);

export = router;
