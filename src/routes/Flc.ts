import express from "express";

import {
    addFlc,
    addFlcByList,
    getByLoanIds,
} from "../controllers/FlcController";

const router = express.Router();

router.post("/addFlc", addFlc);
router.post("/addFlcByList", addFlcByList);
router.get("/getByLoanIds", getByLoanIds);

export = router;
