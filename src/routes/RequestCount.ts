import express from "express";

import {
    addRequestCount,
    addRequestCountByList,
    getByReportId,
} from "../controllers/RequestCountController";

const router = express.Router();

router.post("/addRequestCount", addRequestCount);
router.post("/addRequestCountByList", addRequestCountByList);
router.get("/getByReportId/:reportId", getByReportId);

export = router;
