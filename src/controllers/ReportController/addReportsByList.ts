import { Request, Response } from "express";
import Logging from "../../library/Logging";
import { ReportModel } from "../../models";

const addReportsByList = async (req: Request, res: Response) => {
    const reports = req.body;

    if (!reports.length) {
        return res.sendStatus(400);
    }

    try {
        const result = await ReportModel.insertMany(reports);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export default addReportsByList;
