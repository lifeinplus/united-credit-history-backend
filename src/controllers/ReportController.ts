import { Request, Response } from "express";

import Logging from "../library/Logging";
import { ReportModel } from "../models";
import PersonService from "../services/PersonService";
import RequestCountService from "../services/RequestCountService";
import CommonService from "../services/CommonService";
import LoanService from "../services/LoanService";
import type { PaginationOptions } from "../types";

export const addReport = async (req: Request, res: Response) => {
    const report = req.body;

    if (!Object.keys(report).length) {
        return res.sendStatus(400);
    }

    try {
        const result = await ReportModel.create(report);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const addReportsByList = async (req: Request, res: Response) => {
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
    const { page, limit, search, skip, from, to }: PaginationOptions =
        res.locals.paginationOptions;

    try {
        const total = await ReportModel.countDocuments({
            clientName: new RegExp(search, "i"),
        });

        const totalPages = Math.ceil(total / limit);
        const toEntry = to > total ? total : to;

        const reports = await ReportModel.find({
            clientName: new RegExp(search, "i"),
        })
            .skip(skip)
            .limit(limit)
            .select("-__v")
            .sort("appNumber")
            .exec();

        const result = {
            results: reports,
            page,
            total,
            totalPages,
            fromEntry: from,
            toEntry,
        };

        return result.results.length
            ? res.status(200).json(result)
            : res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ error });
    }
};
