import { Request, Response } from "express";

import Logging from "../../library/Logging";
import { UserModel } from "../../models";

const logout = async (req: Request, res: Response) => {
    const cookies = req.cookies;

    if (!cookies.jwt) {
        return res.sendStatus(204);
    }

    res.clearCookie("jwt");

    try {
        const foundUser = await UserModel.findOne({
            refreshToken: cookies.jwt,
        }).exec();

        if (foundUser) {
            foundUser.refreshToken = foundUser.refreshToken.filter(
                (token) => token !== cookies.jwt
            );

            await foundUser.save();
        }

        return res.sendStatus(200);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(403).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export default logout;
