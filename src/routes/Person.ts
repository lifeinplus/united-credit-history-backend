import express from "express";

import {
    addPerson,
    addPersonsByList,
    getPersonsByReportId,
} from "../controllers/PersonController";

const router = express.Router();

router.get("/:reportId", getPersonsByReportId);

router.post("/", addPerson);
router.post("/list", addPersonsByList);

export = router;
