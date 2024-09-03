import { Request, Response } from "express";

import Logging from "../library/Logging";
import { PaymentHistoryModel } from "../models";
import PaymentHistoryService from "../services/PaymentHistoryService";

export const addPaymentHistory = async (req: Request, res: Response) => {
    const paymentHistory = req.body;

    if (!Object.keys(paymentHistory).length) {
        return res.sendStatus(400);
    }

    try {
        const result = await PaymentHistoryModel.create(paymentHistory);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const addPaymentHistoryByList = async (req: Request, res: Response) => {
    const paymentHistories = req.body;

    if (!paymentHistories.length) {
        return res.sendStatus(400);
    }

    try {
        const result = await PaymentHistoryModel.insertMany(paymentHistories);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

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
