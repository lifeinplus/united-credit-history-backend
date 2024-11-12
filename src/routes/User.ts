import express from "express";

import ROLE_LIST from "../config/role_list";
import {
    changeUserAvatarById,
    changeUserPasswordById,
    deleteUserById,
    editUserById,
    getUserAvatarByIdAndFilename,
    getUsersPaginated,
    getUsers,
} from "../controllers/UserController";
import { fileUploadLimiter, pagination, rolesVerifier } from "../middleware";

const router = express.Router();

router.get("/", rolesVerifier(ROLE_LIST.admin), getUsers);
router.get("/:id/avatar/:filename", getUserAvatarByIdAndFilename);
router.get(
    "/paginated",
    rolesVerifier(ROLE_LIST.admin),
    pagination,
    getUsersPaginated
);

router.put("/:id", rolesVerifier(ROLE_LIST.admin), editUserById);
router.put(
    "/:id/avatar",
    fileUploadLimiter([".png", ".jpg", ".jpeg"]),
    changeUserAvatarById
);
router.put("/:id/password", changeUserPasswordById);

router.delete("/:id", rolesVerifier(ROLE_LIST.admin), deleteUserById);

export = router;
