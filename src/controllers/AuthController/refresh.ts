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
                config.auth.refreshToken.secret
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
            config.auth.refreshToken.secret
        ) as UserJwtPayload;

        if (username !== decoded.username) {
            return res.status(403).json({ message: "Username incorrect" });
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

        refreshTokenArray = refreshTokens.filter(
            (token) => token !== cookies.jwt
        );

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
