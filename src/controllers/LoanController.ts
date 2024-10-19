import { Request, Response } from "express";

import Logging from "../library/Logging";
import { LoanModel } from "../models";
import LoanService from "../services/LoanService";

export const addLoan = async (req: Request, res: Response) => {
    const loan = req.body;

    if (!Object.keys(loan).length) {
        return res.sendStatus(400);
    }

    try {
        const result = await LoanModel.create(loan);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const addLoansByList = async (req: Request, res: Response) => {
    const loans = req.body;

    if (!loans.length) {
        return res.sendStatus(400);
    }

    try {
        const result = await LoanModel.insertMany(loans);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const getLoansByReportId = async (req: Request, res: Response) => {
    const { reportId } = req.params;

    try {
        const loans = await LoanService.getByReportId(reportId);

        return loans.length
            ? res.status(200).json(loans)
            : res.status(404).json({ message: "Loans not found" });
    } catch (error) {
        return res.status(500).json({ error });
    }
};
