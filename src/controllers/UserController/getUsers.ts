import { Request, Response } from "express";

import Logging from "../../library/Logging";
import { UserModel } from "../../models";

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find()
            .select("-password -refreshTokens")
            .sort("creationDate")
            .lean();

        const result = users.map((user) => ({
            ...user,
            roles: JSON.stringify(user.roles),
        }));

        return result.length
            ? res.status(200).json(result)
            : res.status(404).json({ message: "Users not found" });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};
