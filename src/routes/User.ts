import express from "express";

import {
    changeAvatar,
    deleteById,
    getAll,
    getPaginated,
    updateById,
} from "../controllers/UserController";

import { filesPayloadExists, pagination } from "../middleware";

const router = express.Router();

router.get("/getAll", getAll);
router.get("/getPaginated", pagination, getPaginated);
router.post("/:id/changeAvatar", filesPayloadExists, changeAvatar);
router.put("/updateById", updateById);
router.delete("/deleteById/:id", deleteById);

export = router;
