import { Request, Response } from "express";
import path from "path";

import Logging from "../../library/Logging";

export const getUserAvatarByIdAndFilename = async (
    req: Request,
    res: Response
) => {
    const filePath = path.join(
        __dirname,
        "..",
        "..",
        "..",
        "uploads",
        "users",
        req.params.id,
        req.params.filename
    );

    res.sendFile(filePath, (err) => {
        if (err) {
            Logging.error(err);
            res.status(404).send("File not found");
        }
    });
};
