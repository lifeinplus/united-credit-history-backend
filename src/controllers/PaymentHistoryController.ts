import { Request, Response } from "express";
import PaymentHistoryService from "../services/PaymentHistoryService";

export const getByLoanIds = async (req: Request, res: Response) => {
    const { loanIds } = req.query;

    try {
        const paymentHistories = await PaymentHistoryService.getByLoanIds(
            loanIds as string | string[]
        );

        return paymentHistories.length
            ? res.status(200).json(paymentHistories)
            : res.status(404).json({ message: "PaymentHistories not found" });
    } catch (error) {
        return res.status(500).json({ error });
    }
};
