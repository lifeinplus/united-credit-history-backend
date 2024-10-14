import express from "express";

import {
    addFlcs,
    addFlcsByList,
    getFlcsByLoanIds,
} from "../controllers/FlcController";

const router = express.Router();

router.get("/loan-ids", getFlcsByLoanIds);

router.post("/", addFlcs);
router.post("/list", addFlcsByList);

export = router;
