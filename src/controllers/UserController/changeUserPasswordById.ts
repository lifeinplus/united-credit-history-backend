import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { config } from "../../config";
import Logging from "../../library/Logging";
import { UserModel } from "../../models";

export const changeUserPasswordById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!id) {
        return res.status(400).json({
            message: `User ID required`,
        });
    }

    if (!newPassword || newPassword.length < config.auth.passwordLengthMin) {
        return res.status(400).json({
            message: `Password is required and should be at least ${config.auth.passwordLengthMin} characters long`,
        });
    }

    if (currentPassword === newPassword) {
        return res.status(400).json({
            message: `New password must be different from current password`,
        });
    }

    try {
        const foundUser = await UserModel.findById(id)
            .select("-refreshTokens")
            .exec();

        if (!foundUser) {
            return res.status(401).json({ message: "User not found" });
        }

        const {
            _id: userId,
            avatarName,
            firstName,
            lastName,
            password,
            roles,
            username,
        } = foundUser;

        const isMatch = await bcrypt.compare(currentPassword, password);

        if (!isMatch) {
            return res
                .status(409)
                .json({ message: "Current password is incorrect" });
        }

        const roleValues = Object.values(roles || {});

        const newAccessToken = jwt.sign(
            { userId, username, roles: roleValues },
            config.auth.accessToken.secret,
            config.auth.accessToken.options
        );

        const newRefreshToken = jwt.sign(
            { username },
            config.auth.refreshToken.secret,
            config.auth.refreshToken.options
        );

        const newHashedPassword = await bcrypt.hash(newPassword, 10);

        foundUser.isPasswordChangeRequired = false;
        foundUser.password = newHashedPassword;
        foundUser.refreshTokens = [newRefreshToken];

        await foundUser.save();

        return res
            .status(200)
            .cookie("jwt", newRefreshToken, config.auth.cookieOptions)
            .json({
                accessToken: newAccessToken,
                avatarName,
                firstName,
                isPasswordChangeRequired: false,
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
