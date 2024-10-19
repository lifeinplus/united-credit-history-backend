import { Request, Response } from "express";
import { ReportModel } from "../../models";
import type { PaginationOptions } from "../../types";

const getReportsPaginated = async (req: Request, res: Response) => {
    const {
        page,
        limit,
        search,
        skip,
        from,
        to,
        sort,
        order,
    }: PaginationOptions = res.locals.paginationOptions;

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
            .sort({ [sort]: order })
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

export default getReportsPaginated;
