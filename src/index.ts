import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";

import { config } from "./config";
import ROLE_LIST from "./config/role_list";
import Logging from "./library/Logging";
import {
    jwtVerifier,
    passwordVerifier,
    requestLogger,
    rolesVerifier,
} from "./middleware";

import {
    Auth,
    Common,
    Delinquency,
    Flc,
    Loan,
    PaymentHistory,
    Person,
    Report,
    RequestCount,
    User,
} from "./routes";

const app = express();

mongoose
    .connect(config.mongo.uri, { authSource: "admin" })
    .then(() => {
        Logging.info("Server connected to MongoDB");
        StartServer();
    })
    .catch((error) => {
        Logging.error("Unable to connect to MongoDB:");
        Logging.error(error);
    });

const StartServer = () => {
    app.use(requestLogger);
    app.use(cors(config.cors));
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    // app.use(express.json({ limit: 52428800 }));
    app.use(fileUpload({ createParentPath: true }));

    app.get("/ping", (req, res, next) =>
        res.status(200).json({ message: "pong" })
    );

    app.use("/auth", Auth);
    app.use(jwtVerifier);
    app.use(passwordVerifier);
    app.use(rolesVerifier(ROLE_LIST.user));
    app.use("/commons", Common);
    app.use("/delinquencies", Delinquency);
    app.use("/flcs", Flc);
    app.use("/loans", Loan);
    app.use("/payment-histories", PaymentHistory);
    app.use("/persons", Person);
    app.use("/reports", Report);
    app.use("/request-counts", RequestCount);
    app.use("/users", User);

    app.use((req, res, next) => {
        const error = new Error("URL not found");
        Logging.error(error);
        return res.status(404).json({ message: error.message });
    });

    app.listen(config.server.port, () => {
        Logging.info(`Server is running on port ${config.server.port}`);
    });
};
