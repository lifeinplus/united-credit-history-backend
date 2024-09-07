import express from "express";

import {
    addCommon,
    addCommonByList,
    getByReportId,
} from "../controllers/CommonController";

const router = express.Router();

router.post("/addCommon", addCommon);
router.post("/addCommonByList", addCommonByList);
router.get("/getByReportId/:reportId", getByReportId);

export = router;
