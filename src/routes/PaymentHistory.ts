import express from "express";
import { getByLoanIds } from "../controllers/PaymentHistoryController";

const router = express.Router();

router.get("/getByLoanIds", getByLoanIds);

export = router;
