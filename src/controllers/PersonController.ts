import { Request, Response } from "express";

import Logging from "../library/Logging";
import { PersonModel } from "../models";
import PersonService from "../services/PersonService";

export const addPerson = async (req: Request, res: Response) => {
    const person = req.body;

    if (!Object.keys(person).length) {
        return res.sendStatus(400);
    }

    try {
        const result = await PersonModel.create(person);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const addPersonsByList = async (req: Request, res: Response) => {
    const persons = req.body;

    if (!persons.length) {
        return res.sendStatus(400);
    }

    try {
        const result = await PersonModel.insertMany(persons);
        return res.status(201).json(result);
    } catch (error) {
        Logging.error(error);

        if (error instanceof Error) {
            return res.status(500).json({ message: error.message });
        }

        return res.status(500).json({ error });
    }
};

export const getByReportId = async (req: Request, res: Response) => {
    const { reportId } = req.params;

    try {
        const persons = await PersonService.getByReportId(reportId);

        return persons.length
            ? res.status(200).json(persons)
            : res.status(404).json({ message: "Persons not found" });
    } catch (error) {
        return res.status(500).json({ error });
    }
};
