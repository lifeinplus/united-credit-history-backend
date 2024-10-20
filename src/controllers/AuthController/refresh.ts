import { Request, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import { config } from "../../config";
import Logging from "../../library/Logging";
import { UserModel } from "../../models";
import { UserJwtPayload } from "../../types";

const refresh = async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies.jwt) {
        return res.status(401).json({ message: "Refresh token not found" });
    }

    res.clearCookie("jwt");

    let foundUser;
    let refreshTokenArray: string[] = [];

    try {
        foundUser = await UserModel.findOne({
            refreshTokens: cookies.jwt,
        }).exec();

        if (!foundUser) {
            const decoded = jwt.verify(
                cookies.jwt,
                config.token.refresh.secret
            ) as UserJwtPayload;

            Logging.warn("Attempted refresh token reuse at /auth/refresh");

            const hackedUser = await UserModel.findOne({
                username: decoded.username,
            }).exec();

            if (hackedUser) {
                hackedUser.refreshTokens = [];
                await hackedUser.save();
            }

            return res.sendStatus(403);
        }

        const {
            _id: userId,
            avatarPath,
            firstName,
            lastName,
            refreshTokens,
            roles,
            username,
        } = foundUser;

        const decoded = jwt.verify(
            cookies.jwt,
            config.token.refresh.secret
        ) as UserJwtPayload;

        if (username !== decoded.username) {
            return res.status(403).json({ message: "Username incorrect" });
        }

        const roleValues = Object.values(roles || {});

        const newAccessToken = jwt.sign(
            { username, roles: roleValues },
            config.token.access.secret,
            { expiresIn: config.token.access.expiresIn }
        );

        const newRefreshToken = jwt.sign(
            { username },
            config.token.refresh.secret,
            { expiresIn: config.token.refresh.expiresIn }
        );

        refreshTokenArray = refreshTokens.filter(
            (token) => token !== cookies.jwt
        );

        foundUser.refreshTokens = [...refreshTokenArray, newRefreshToken];
        await foundUser.save();

        return res
            .status(200)
            .cookie("jwt", newRefreshToken, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
            })
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

        if (error instanceof TokenExpiredError) {
            if (foundUser) {
                foundUser.refreshTokens = [...refreshTokenArray];
                await foundUser.save();
            }

            return res.status(403).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export default refresh;
