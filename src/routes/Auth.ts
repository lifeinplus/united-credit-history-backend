import express from "express";

import {
    login,
    logout,
    refreshToken,
    register,
} from "../controllers/AuthController";

const router = express.Router();

router.post("/login", login);
router.get("/logout", logout);
router.get("/refreshToken", refreshToken);
router.post("/register", register);

export = router;
