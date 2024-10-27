import { NextFunction, Request, Response } from "express";
import Logging from "../library/Logging";

const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const { method, url } = req;
    const { statusCode } = res;

    Logging.infoIn(`Method: [{method}] - URL: [${url}]`, method);

    res.on("finish", () => {
        Logging.infoOut(
            `Method: [{method}] - URL: [${url}] - Status: [${statusCode}]`,
            method
        );
    });

    next();
};

export default requestLogger;
