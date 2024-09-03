import { Request, Response } from "express";

import Logging from "../library/Logging";
import { CommonModel } from "../models";
import CommonService from "../services/CommonService";

export const addCommon = async (req: Request, res: Response) => {
    const common = req.body;

    if (!Object.keys(common).length) {
        return res.sendStatus(400);
    }

    try {
        const result = await CommonModel.create(common);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const addCommonByList = async (req: Request, res: Response) => {
    const commons = req.body;

    if (!commons.length) {
        return res.sendStatus(400);
    }

    try {
        const result = await CommonModel.insertMany(commons);
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
        const commons = await CommonService.getByReportId(reportId);

        return commons
            ? res.status(200).json(commons)
            : res.status(404).json({ message: "Commons not found" });
    } catch (error) {
        return res.status(500).json({ error });
    }
};
