import express from "express";
import { getByReportId } from "../controllers/CommonController";

const router = express.Router();

router.get("/getByReportId/:reportId", getByReportId);

export = router;
