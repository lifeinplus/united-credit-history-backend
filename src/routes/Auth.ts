import express from "express";

import {
    login,
    logout,
    refresh,
    register,
} from "../controllers/AuthController";

const router = express.Router();

router.post("/login", login);
router.get("/logout", logout);
router.get("/refresh", refresh);
router.post("/register", register);

export = router;
