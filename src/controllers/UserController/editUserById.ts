import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { config } from "../../config";
import { UserModel } from "../../models";
import Logging from "../../library/Logging";

export const editUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isResetPassword, roles } = req.body;

    if (!id) {
        return res.status(400).json({
            message: `User ID required`,
        });
    }

    try {
        const user = await UserModel.findById(id)
            .select("-password -refreshTokens")
            .exec();

        if (!user) {
            return res.sendStatus(204);
        }

        if (roles) {
            user.roles = JSON.parse(roles);
        }

        if (isResetPassword) {
            const hashedPassword = await bcrypt.hash(
                config.auth.passwordDefaultReset,
                10
            );
            user.password = hashedPassword;
        }

        await user.save();

        return res
            .status(200)
            .json({ message: "User data successfully changed" });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};
