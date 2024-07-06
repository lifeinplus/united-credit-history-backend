import express from "express";

import {
    deleteById,
    getAll,
    getPaginated,
    updateById,
} from "../controllers/UserController";
import { pagination } from "../middleware";

const router = express.Router();

router.get("/getAll", getAll);
router.get("/getPaginated", pagination, getPaginated);
router.put("/updateById", updateById);
router.delete("/deleteById/:id", deleteById);

export = router;
