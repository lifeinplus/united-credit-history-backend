import { Request, Response } from "express";
import { DelinquencyModel } from "../models";

export const getByLoanIds = (req: Request, res: Response) => {
    const { loanIds } = req.query;

    return DelinquencyModel.find({ loanId: { $in: loanIds } })
        .select("-__v")
        .then((delinquencies) =>
            delinquencies.length
                ? res.status(200).json(delinquencies)
                : res.status(404).json({ message: "Delinquencies not found" })
        )
        .catch((error) => res.status(500).json({ error }));
};
