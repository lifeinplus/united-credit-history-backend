import express from "express";

import { getAll, getById, getPaginated } from "../controllers/ReportController";
import { pagination } from "../middleware";

const router = express.Router();

router.get("/getAll", getAll);
router.get("/getById/:reportId", getById);
router.get("/getPaginated", pagination, getPaginated);

export = router;
