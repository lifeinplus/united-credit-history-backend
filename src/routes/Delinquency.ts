import express from "express";
import { getByLoanIds } from "../controllers/DelinquencyController";

const router = express.Router();

router.get("/getByLoanIds", getByLoanIds);

export = router;
