import { Request, Response } from "express";
import DelinquencyService from "../services/DelinquencyService";

export const getByLoanIds = async (req: Request, res: Response) => {
    const { loanIds } = req.query;

    try {
        const delinquencies = await DelinquencyService.getByLoanIds(
            loanIds as string | string[]
        );

        return delinquencies.length
            ? res.status(200).json(delinquencies)
            : res.status(404).json({ message: "Delinquencies not found" });
    } catch (error) {
        return res.status(500).json({ error });
    }
};
