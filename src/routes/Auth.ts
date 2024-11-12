import express from "express";

import {
    login,
    logout,
    refresh,
    register,
} from "../controllers/AuthController";

const router = express.Router();

router.get("/refresh", refresh);

router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);

export = router;
