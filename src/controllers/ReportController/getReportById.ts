import { Request, Response } from "express";
import { ReportModel } from "../../models";

const getReportById = (req: Request, res: Response) => {
    const { id } = req.params;

    return ReportModel.findById(id)
        .select("-__v")
        .then((report) =>
            report
                ? res.status(200).json(report)
                : res.status(404).json({ message: "Report not found" })
        )
        .catch((error) => res.status(500).json({ error }));
};

export default getReportById;
