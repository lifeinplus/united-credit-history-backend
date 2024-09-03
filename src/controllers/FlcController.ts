import { Request, Response } from "express";

import Logging from "../library/Logging";
import { FlcModel } from "../models";
import FlcService from "../services/FlcService";

export const addFlc = async (req: Request, res: Response) => {
    const flc = req.body;

    if (!Object.keys(flc).length) {
        return res.sendStatus(400);
    }

    try {
        const result = await FlcModel.create(flc);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const addFlcByList = async (req: Request, res: Response) => {
    const flcs = req.body;

    if (!flcs.length) {
        return res.sendStatus(400);
    }

    try {
        const result = await FlcModel.insertMany(flcs);
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
