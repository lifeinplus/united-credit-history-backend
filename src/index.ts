import cors from "cors";
import express from "express";
import mongoose from "mongoose";

import { config } from "./config";
import Logging from "./library/Logging";

import {
    Common,
    Delinquency,
    Flc,
    Loan,
    PaymentHistory,
    Person,
    Report,
    RequestCount,
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
    app.use((req, res, next) => {
        Logging.info(
            `Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]]`,
            "incoming"
        );

        res.on("finish", () => {
            Logging.info(
                `Method: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]] - Status: [${res.statusCode}]`,
                "outgoing"
            );
        });

        next();
    });

    app.use(cors());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    app.use("/commons", Common);
    app.use("/delinquencies", Delinquency);
    app.use("/flcs", Flc);
    app.use("/loans", Loan);
    app.use("/paymenthistories", PaymentHistory);
    app.use("/persons", Person);
    app.use("/reports", Report);
    app.use("/requestCounts", RequestCount);

    app.get("/ping", (req, res, next) =>
        res.status(200).json({ message: "pong" })
    );

    app.use((req, res, next) => {
        const error = new Error("URL not found");
        Logging.error(error);
        return res.status(404).json({ message: error.message });
    });

    app.listen(config.server.port, () => {
        Logging.info(`Server is running on port ${config.server.port}`);
    });
};
