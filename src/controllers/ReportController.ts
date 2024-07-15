import { Request, Response } from "express";

import Logging from "../library/Logging";
import { ReportModel } from "../models";
import PersonService from "../services/PersonService";
import RequestCountService from "../services/RequestCountService";
import CommonService from "../services/CommonService";
import LoanService from "../services/LoanService";

export const getAll = (req: Request, res: Response) => {
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

export const getById = (req: Request, res: Response) => {
    const { reportId } = req.params;

    return ReportModel.findById(reportId)
        .select("-__v")
        .then((report) =>
            report
                ? res.status(200).json(report)
                : res.status(404).json({ message: "Report not found" })
        )
        .catch((error) => res.status(500).json({ error }));
};

export const getFullById = async (req: Request, res: Response) => {
    const { reportId } = req.params;

    try {
        const report = await ReportModel.findById(reportId)
            .lean()
            .select("-__v")
            .exec();

        const commons = await CommonService.getByReportId(reportId);
        const loans = await LoanService.getFullByReportId(reportId);
        const requestCounts = await RequestCountService.getByReportId(reportId);
        const persons = await PersonService.getByReportId(reportId);

        const result = { ...report, commons, loans, requestCounts, persons };

        return report
            ? res.status(200).json(result)
            : res.status(404).json({ message: "Report not found" });
    } catch (error) {
        Logging.error(error);
        return res.status(500).json({ error });
    }
};

export const getPaginated = async (req: Request, res: Response) => {
    const { page, limit, skip } = res.locals.paginationOptions;

    try {
        const total = await ReportModel.countDocuments();
        const totalPages = Math.ceil(total / limit);

        const reports = await ReportModel.find()
            .skip(skip)
            .limit(limit)
            .select("-__v")
            .sort("appNumber")
            .exec();

        const results = reports;
        const result = { results, page, total, totalPages };

        return result.results.length
            ? res.status(200).json(result)
            : res.status(404).json({ message: "Reports not found" });
    } catch (error) {
        return res.status(500).json({ error });
    }
};
