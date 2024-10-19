import { Request, Response } from "express";

import Logging from "../library/Logging";
import { DelinquencyModel } from "../models";
import DelinquencyService from "../services/DelinquencyService";

export const addDelinquencies = async (req: Request, res: Response) => {
    const delinquency = req.body;

    if (!Object.keys(delinquency).length) {
        return res.sendStatus(400);
    }

    try {
        const result = await DelinquencyModel.create(delinquency);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const addDelinquenciesByList = async (req: Request, res: Response) => {
    const delinquencies = req.body;

    if (!delinquencies.length) {
        return res.sendStatus(400);
    }

    try {
        const result = await DelinquencyModel.insertMany(delinquencies);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const getDelinquenciesByLoanIds = async (
    req: Request,
    res: Response
) => {
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
