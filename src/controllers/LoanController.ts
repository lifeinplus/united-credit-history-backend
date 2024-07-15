import { Request, Response } from "express";
import LoanService from "../services/LoanService";

export const getByReportId = async (req: Request, res: Response) => {
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
