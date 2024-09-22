import express from "express";

import {
    changePassword,
    login,
    logout,
    refresh,
    register,
} from "../controllers/AuthController";

const router = express.Router();

router.get("/logout", logout);
router.get("/refresh", refresh);
router.post("/login", login);
router.post("/register", register);
router.put("/changePassword", changePassword);

export = router;
