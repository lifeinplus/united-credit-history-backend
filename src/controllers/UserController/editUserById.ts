import { Request, Response } from "express";

import { UserModel } from "../../models";
import Logging from "../../library/Logging";

const editUserById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { roles } = req.body;

    if (!id) {
        return res.status(400).json({
            message: `User ID required`,
        });
    }

    try {
        const user = await UserModel.findById(id)
            .select("-password -refreshToken")
            .exec();

        if (!user) {
            return res.sendStatus(204);
        }

        if (roles) {
            user.roles = JSON.parse(roles);
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

export default editUserById;
