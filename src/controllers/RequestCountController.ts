import { Request, Response } from "express";

import Logging from "../library/Logging";
import { RequestCountModel } from "../models";
import RequestCountService from "../services/RequestCountService";

export const addRequestCount = async (req: Request, res: Response) => {
    const requestCount = req.body;

    if (!Object.keys(requestCount).length) {
        return res.sendStatus(400);
    }

    try {
        const result = await RequestCountModel.create(requestCount);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const addRequestCountByList = async (req: Request, res: Response) => {
    const requestCounts = req.body;

    if (!requestCounts.length) {
        return res.sendStatus(400);
    }

    try {
        const result = await RequestCountModel.insertMany(requestCounts);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const getByReportId = async (req: Request, res: Response) => {
    const { reportId } = req.params;

    try {
        const requestCounts = await RequestCountService.getByReportId(reportId);

        return requestCounts
            ? res.status(200).json(requestCounts)
            : res.status(404).json({ message: "RequestCounts not found" });
    } catch (error) {
        return res.status(500).json({ error });
    }
};
