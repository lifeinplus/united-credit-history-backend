import express from "express";

import {
    addRequestCounts,
    addRequestCountsByList,
    getRequestCountsByReportId,
} from "../controllers/RequestCountController";

const router = express.Router();

router.get("/:reportId", getRequestCountsByReportId);

router.post("/", addRequestCounts);
router.post("/list", addRequestCountsByList);

export = router;
