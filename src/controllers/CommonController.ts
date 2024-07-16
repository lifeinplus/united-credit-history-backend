import { Request, Response } from "express";
import CommonService from "../services/CommonService";

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
