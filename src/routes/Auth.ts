import express from "express";

import {
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

export = router;
