import { Request, Response } from "express";

import { UserModel } from "../../models";
import Logging from "../../library/Logging";

const deleteById = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: `User ID required`,
        });
    }

    try {
        const user = await UserModel.findOne({ _id: id })
            .select("-password -refreshToken")
            .exec();

        if (!user) {
            return res.sendStatus(204);
        }

        const result = await user.deleteOne({ _id: id });

        return res.json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export default deleteById;
