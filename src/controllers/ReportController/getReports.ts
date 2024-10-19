import { Request, Response } from "express";
import { ReportModel } from "../../models";

const getReports = (req: Request, res: Response) => {
    return ReportModel.find()
        .select("-__v")
        .sort("appNumber")
        .then((reports) =>
            reports.length
                ? res.status(200).json(reports)
                : res.status(404).json({ message: "Reports not found" })
        )
        .catch((error) => res.status(500).json({ error }));
};

export default getReports;
