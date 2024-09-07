import express from "express";

import {
    addPerson,
    addPersonsByList,
    getByReportId,
} from "../controllers/PersonController";

const router = express.Router();

router.post("/addPerson", addPerson);
router.post("/addPersonsByList", addPersonsByList);
router.get("/getByReportId/:reportId", getByReportId);

export = router;
