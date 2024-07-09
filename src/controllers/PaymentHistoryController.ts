import { Request, Response } from "express";
import { PaymentHistoryModel } from "../models";

export const getByLoanIds = (req: Request, res: Response) => {
    const { loanIds } = req.query;

    return PaymentHistoryModel.find({ loanId: { $in: loanIds } })
        .select("-__v")
        .then((paymentHistories) =>
            paymentHistories.length
                ? res.status(200).json(paymentHistories)
                : res
                      .status(404)
                      .json({ message: "PaymentHistories not found" })
        )
        .catch((error) => res.status(500).json({ error }));
};
