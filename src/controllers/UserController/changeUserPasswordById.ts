import bcrypt from "bcrypt";
import { Request, Response } from "express";

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

    if (!newPassword || newPassword.length < 4) {
        return res.status(400).json({
            message: `Password is required and should be at least 4 characters long`,
        });
    }

    if (currentPassword === newPassword) {
        return res.status(400).json({
            message: `New password must be different from current password`,
        });
    }

    try {
        const user = await UserModel.findOne({ _id: id })
            .select("-refreshToken")
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
        const result = await user.save();

        return res.status(200).json({ id: result._id });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export default changeUserPasswordById;
