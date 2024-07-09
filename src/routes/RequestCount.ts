import express from "express";
import { getByReportId } from "../controllers/RequestCountController";

const router = express.Router();

router.get("/getByReportId/:reportId", getByReportId);

export = router;
