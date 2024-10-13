import { Request, Response } from "express";

import Logging from "../../library/Logging";
import { UserModel } from "../../models";

const getAll = async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find()
            .select("-password -refreshToken")
            .sort("creationDate");

        const result = users.map((user) => {
            const { _id, creationDate, userName, roles } = user;
            return {
                _id,
                creationDate,
                userName,
                roles: JSON.stringify(roles),
            };
        });

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

export default getAll;
