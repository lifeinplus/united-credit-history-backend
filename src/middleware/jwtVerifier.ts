import { NextFunction, Response } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";

import { config } from "../config";
import Logging from "../library/Logging";
import { UserRequest, UserJwtPayload } from "../types";

const jwtVerifier = (req: UserRequest, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;

    const token = authorization?.startsWith("Bearer ")
        ? authorization?.replace("Bearer ", "")
        : undefined;

    if (!token || token === "undefined") {
        return res.sendStatus(401);
    }

    try {
        const decoded = jwt.verify(
            token,
            config.token.access.secret
        ) as UserJwtPayload;

        req.roles = decoded.roles;
        next();
    } catch (error) {
        Logging.error(error);

        if (error instanceof TokenExpiredError) {
            return res
                .status(403)
                .json({ message: "jwtVerifier: " + error.message });
        }

        return res.status(500).json({ error });
    }
};

export default jwtVerifier;
