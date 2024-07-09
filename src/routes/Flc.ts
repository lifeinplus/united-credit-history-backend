import express from "express";
import { getByLoanIds } from "../controllers/FlcController";

const router = express.Router();

router.get("/getByLoanIds", getByLoanIds);

export = router;
