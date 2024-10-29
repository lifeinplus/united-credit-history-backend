import bcrypt from "bcrypt";
import { Request, Response } from "express";

import { config } from "../../config";
import Logging from "../../library/Logging";
import { UserModel } from "../../models";

const changeUserPasswordById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!id) {
        return res.status(400).json({
            message: `User ID required`,
        });
    }

    if (!newPassword || newPassword.length < config.auth.passwordLengthMin) {
        return res.status(400).json({
            message: `Password is required and should be at least ${config.auth.passwordLengthMin} characters long1`,
        });
    }

    if (currentPassword === newPassword) {
        return res.status(400).json({
            message: `New password must be different from current password`,
        });
    }

    try {
        const user = await UserModel.findById(id)
            .select("-refreshTokens")
            .exec();

        if (!user) {
            return res.sendStatus(204);
        }

        const match = await bcrypt.compare(currentPassword, user.password);

        if (!match) {
            return res
                .status(409)
                .json({ message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        await user.save();

        return res
            .status(200)
            .json({ message: "Password successfully changed" });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export default changeUserPasswordById;
