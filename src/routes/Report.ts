import express from "express";

import {
    addReport,
    addReportsByList,
    getReportById,
    getReportFullById,
    getReports,
    getReportsPaginated,
} from "../controllers/ReportController";
import { pagination } from "../middleware";

const router = express.Router();

router.get("/", getReports);
router.get("/paginated", pagination, getReportsPaginated);
router.get("/:id", getReportById);
router.get("/:id/full", getReportFullById);

router.post("/", addReport);
router.post("/list", addReportsByList);

export = router;
