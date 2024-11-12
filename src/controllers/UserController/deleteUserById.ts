import { Request, Response } from "express";

import { UserModel } from "../../models";
import Logging from "../../library/Logging";

export const deleteUserById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: `User ID required`,
        });
    }

    try {
        await UserModel.findByIdAndDelete(id);
        return res.status(200).json({ message: "User successfully deleted" });
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};
