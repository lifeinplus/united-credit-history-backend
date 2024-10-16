import express from "express";

import ROLE_LIST from "../config/role_list";
import {
    changeAvatar,
    deleteById,
    getAll,
    getPaginated,
    updateById,
} from "../controllers/UserController";
import { fileUploadLimiter, pagination, rolesVerifier } from "../middleware";

const router = express.Router();

router.get("/getAll", rolesVerifier(ROLE_LIST.admin), getAll);

router.get(
    "/getPaginated",
    rolesVerifier(ROLE_LIST.admin),
    pagination,
    getPaginated
);

router.put(
    "/:id/changeAvatar",
    fileUploadLimiter([".png", ".jpg", ".jpeg"]),
    changeAvatar
);

router.put("/updateById", rolesVerifier(ROLE_LIST.admin), updateById);

router.delete("/deleteById/:id", rolesVerifier(ROLE_LIST.admin), deleteById);

export = router;
