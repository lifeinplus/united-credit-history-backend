import { NextFunction, Request, Response } from "express";

const filesPayloadExists = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.files) {
        return res.status(400).json({ message: "Missing files" });
    }

    next();
};

export default filesPayloadExists;
