import { Request, Response } from "express";
import { FlcModel } from "../models";

export const getByLoanIds = (req: Request, res: Response) => {
    const { loanIds } = req.query;

    return FlcModel.find({ loanId: { $in: loanIds } })
        .select("-__v")
        .then((flcs) =>
            flcs.length
                ? res.status(200).json(flcs)
                : res.status(404).json({ message: "Flcs not found" })
        )
        .catch((error) => res.status(500).json({ error }));
};
