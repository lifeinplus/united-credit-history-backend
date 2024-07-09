import { Request, Response } from "express";
import { LoanModel } from "../models";

export const getByReportId = (req: Request, res: Response) => {
    const { reportId } = req.params;

    return LoanModel.find({ reportId })
        .select("-__v")
        .then((loans) =>
            loans.length
                ? res.status(200).json(loans)
                : res.status(404).json({ message: "Loans not found" })
        )
        .catch((error) => res.status(500).json({ error }));
};
