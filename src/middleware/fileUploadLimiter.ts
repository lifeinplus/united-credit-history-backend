import { NextFunction, Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import path from "path";

import { config } from "../config";

const KB = config.fileUpload.sizeKb;
const FILE_SIZE_LIMIT = KB * 1024;

const fileUploadLimiter = (allowedExtArray: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.files || !Object.keys(req.files).length) {
            return res.status(400).json({ message: "Missing files" });
        }

        const overSize = Object.values(req.files).some(
            (file) => (file as UploadedFile).size > FILE_SIZE_LIMIT
        );

        if (overSize) {
            return res.status(413).json({
                message: `The file exceeds the size limit of ${KB}KB`,
            });
        }

        const allowedExt = Object.values(req.files).every((file) =>
            allowedExtArray.includes(path.extname((file as UploadedFile).name))
        );

        if (!allowedExt) {
            const message = `Only ${allowedExtArray} files allowed`.replaceAll(
                ",",
                ", "
            );
            return res.status(422).json({ message });
        }

        next();
    };
};

export default fileUploadLimiter;
