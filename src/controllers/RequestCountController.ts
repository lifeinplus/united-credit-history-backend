import { Request, Response } from "express";
import { RequestCountModel } from "../models";

export const getByReportId = (req: Request, res: Response) => {
    const { reportId } = req.params;

    return RequestCountModel.findOne({ reportId })
        .select("-__v")
        .then((requestCounts) =>
            requestCounts
                ? res.status(200).json(requestCounts)
                : res.status(404).json({ message: "RequestCounts not found" })
        )
        .catch((error) => res.status(500).json({ error }));
};
