import express from "express";

import {
    addCommons,
    addCommonsByList,
    getCommonsByReportId,
} from "../controllers/CommonController";

const router = express.Router();

router.get("/:reportId", getCommonsByReportId);

router.post("/", addCommons);
router.post("/list", addCommonsByList);

export = router;
