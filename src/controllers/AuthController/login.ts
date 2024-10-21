import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { config } from "../../config";
import Logging from "../../library/Logging";
import { UserModel } from "../../models";

const login = async (req: Request, res: Response) => {
    const { username: reqUsername, password: reqPassword } = req.body;
    const cookies = req.cookies;

    if (!reqUsername || !reqPassword) {
        return res
            .status(400)
            .json({ message: `Username and password required` });
    }

    try {
        const foundUser = await UserModel.findOne({
            username: reqUsername,
        }).exec();

        if (!foundUser) {
            return res.status(401).json({ message: `User not found` });
        }

        const {
            _id: userId,
            avatarPath,
            firstName,
            lastName,
            password,
            refreshTokens,
            roles,
            username,
        } = foundUser;

        const match = await bcrypt.compare(reqPassword, password);

        if (!match) {
            return res.status(401).json({ message: "Password is incorrect" });
        }

        const roleValues = Object.values(roles || {});

        const newAccessToken = jwt.sign(
            { username, roles: roleValues },
            config.auth.accessToken.secret,
            config.auth.accessToken.options
        );

        const newRefreshToken = jwt.sign(
            { username },
            config.auth.refreshToken.secret,
            config.auth.refreshToken.options
        );

        let refreshTokenArray = refreshTokens.filter(
            (token) => token !== cookies.jwt
        );

        if (cookies.jwt) {
            // Scenario:
            // 1. User logins, never uses RT, doesn't logout
            // 2. RT is stolen
            // 3. Clear all RTs when user logins
            const foundToken = await UserModel.findOne({
                refreshTokens: cookies.jwt,
            }).exec();

            if (!foundToken) {
                Logging.warn("Attempted refresh token reuse at /auth/login");
                refreshTokenArray = [];
            }

            res.clearCookie("jwt");
        }

        foundUser.refreshTokens = [...refreshTokenArray, newRefreshToken];
        await foundUser.save();

        return res
            .status(200)
            .cookie("jwt", newRefreshToken, config.auth.cookieOptions)
            .json({
                accessToken: newAccessToken,
                avatarPath,
                firstName,
                lastName,
                roles: roleValues,
                userId,
                username,
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
