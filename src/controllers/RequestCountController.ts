import { Request, Response } from "express";
import RequestCountService from "../services/RequestCountService";

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
