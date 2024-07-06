import express from "express";
import { getByReportId } from "../controllers/PersonController";

const router = express.Router();

router.get("/getByReportId/:reportId", getByReportId);

export = router;
