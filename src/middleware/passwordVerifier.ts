import { NextFunction, Response } from "express";
import Logging from "../library/Logging";
import { UserModel } from "../models";
import { UserRequest } from "../types";

export const passwordVerifier = async (
    req: UserRequest,
    res: Response,
    next: NextFunction
) => {
    const { userId } = req;

    if (!userId) {
        return res.sendStatus(401);
    }

    if (req.path === `/users/${userId}/password`) {
        return next();
    }

    try {
        const user = await UserModel.findById(userId)
            .select("isPasswordChangeRequired")
            .exec();

        if (user?.isPasswordChangeRequired) {
            return res.status(200).json({
                isPasswordChangeRequired: true,
                message: "Change your password to proceed",
            });
        }

        next();
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error });
    }
};
