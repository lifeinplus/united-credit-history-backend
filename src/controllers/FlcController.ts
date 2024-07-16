import { Request, Response } from "express";
import FlcService from "../services/FlcService";

export const getByLoanIds = async (req: Request, res: Response) => {
    const { loanIds } = req.query;

    try {
        const flcs = await FlcService.getByLoanIds(
            loanIds as string | string[]
        );

        return flcs.length
            ? res.status(200).json(flcs)
            : res.status(404).json({ message: "Flcs not found" });
    } catch (error) {
        return res.status(500).json({ error });
    }
};
