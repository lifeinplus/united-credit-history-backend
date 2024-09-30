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
            refreshToken: cookies.jwt,
        }).exec();

        if (!foundUser) {
            const decoded = jwt.verify(
                cookies.jwt,
                config.token.refresh.secret
            ) as UserJwtPayload;

            Logging.warn("Attempted refresh token reuse at /auth/refresh");

            const hackedUser = await UserModel.findOne({
                userName: decoded.userName,
            }).exec();

            if (hackedUser) {
                hackedUser.refreshToken = [];
                await hackedUser.save();
            }

            return res.sendStatus(403);
        }

        refreshTokenArray = foundUser.refreshToken.filter(
            (token) => token !== cookies.jwt
        );

        const decoded = jwt.verify(
            cookies.jwt,
            config.token.refresh.secret
        ) as UserJwtPayload;

        if (decoded.userName !== foundUser.userName) {
            return res.status(403).json({ message: "User name incorrect" });
        }

        const roles = Object.values(foundUser.roles || {});

        const accessToken = jwt.sign(
            { userName: decoded.userName, roles },
            config.token.access.secret,
            { expiresIn: config.token.access.expiresIn }
        );

        const refreshToken = jwt.sign(
            { userName: foundUser.userName },
            config.token.refresh.secret,
            { expiresIn: config.token.refresh.expiresIn }
        );

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
                roles,
                userId: foundUser._id,
                userName: foundUser.userName,
            });
    } catch (error) {
        Logging.error(error);

        if (error instanceof TokenExpiredError) {
            if (foundUser) {
                foundUser.refreshToken = [...refreshTokenArray];
                await foundUser.save();
            }

            return res.status(403).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export default refresh;
