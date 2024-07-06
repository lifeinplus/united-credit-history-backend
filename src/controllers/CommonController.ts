import { Request, Response } from "express";
import { CommonModel } from "../models";

export const getByReportId = (req: Request, res: Response) => {
    const { reportId } = req.params;

    return CommonModel.findOne({ reportId })
        .select("-__v")
        .then((commons) =>
            commons
                ? res.status(200).json(commons)
                : res.status(404).json({ message: "Commons not found" })
        )
        .catch((error) => res.status(500).json({ error }));
};
