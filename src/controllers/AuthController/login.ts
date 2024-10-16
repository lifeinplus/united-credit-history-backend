import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { config } from "../../config";
import Logging from "../../library/Logging";
import { UserModel } from "../../models";

const login = async (req: Request, res: Response) => {
    const { userName, password } = req.body;
    const cookies = req.cookies;

    if (!userName || !password) {
        return res
            .status(400)
            .json({ message: `Username and password required` });
    }

    try {
        const foundUser = await UserModel.findOne({ userName }).exec();

        if (!foundUser) {
            return res
                .status(401)
                .json({ message: `User [${userName}] not found` });
        }

        const match = await bcrypt.compare(password, foundUser.password);

        if (!match) {
            return res.status(401).json({ message: "Password is incorrect" });
        }

        const roles = Object.values(foundUser.roles || {});

        const accessToken = jwt.sign(
            { userName: foundUser.userName, roles },
            config.token.access.secret,
            { expiresIn: config.token.access.expiresIn }
        );

        const refreshToken = jwt.sign(
            { userName: foundUser.userName },
            config.token.refresh.secret,
            { expiresIn: config.token.refresh.expiresIn }
        );

        let refreshTokenArray = foundUser.refreshToken.filter(
            (token) => token !== cookies.jwt
        );

        if (cookies.jwt) {
            // Scenario:
            // 1. User logins, never uses RT, doesn't logout
            // 2. RT is stolen
            // 3. Clear all RTs when user logins
            const foundToken = await UserModel.findOne({
                refreshToken: cookies.jwt,
            }).exec();

            if (!foundToken) {
                Logging.warn("Attempted refresh token reuse at /auth/login");
                refreshTokenArray = [];
            }

            res.clearCookie("jwt");
        }

        foundUser.refreshToken = [...refreshTokenArray, refreshToken];
        await foundUser.save();

        return res
            .status(200)
            .cookie("jwt", refreshToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            })
            .json({
                accessToken,
                avatarPath: foundUser.avatarPath,
                roles,
                userId: foundUser._id,
            });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export default login;
